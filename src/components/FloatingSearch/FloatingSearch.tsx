import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import { Listbox, Transition, Combobox } from '@headlessui/react';
import { Fragment } from 'react';
import { SearchFilters } from '../../types/index';
import SpiceRating from '../SpiceRating/SpiceRating';
import './FloatingSearch.css';

interface FloatingSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  availableCourses?: string[];
  availableLecturers?: string[];
  availableTags?: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const FloatingSearch: React.FC<FloatingSearchProps> = ({
  onSearch,
  onFiltersChange,
  availableCourses = [],
  availableLecturers = [],
  availableTags = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagQuery, setTagQuery] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    setSelectedTags([]);
    setTagQuery('');
    onFiltersChange(emptyFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
  };

  // Handle tags change from Combobox
  React.useEffect(() => {
    updateFilters({ tags: selectedTags.length > 0 ? selectedTags : undefined });
  }, [selectedTags]);

  const filteredTags = tagQuery === ''
    ? availableTags
    : availableTags.filter((tag) =>
        tag.toLowerCase().includes(tagQuery.toLowerCase())
      );

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="floating-search" ref={searchRef}>
      {/* Search Input */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="search-input"
          />
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setIsOpen(true);
            }}
            className={classNames(
              'filter-button',
              hasActiveFilters || showFilters ? 'filter-button-active' : ''
            )}
          >
            <FunnelIcon className="filter-button-icon" />
          </button>
        </div>
      </div>

      {/* Floating Panel */}
      {isOpen && (
        <div className="floating-panel">
          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-header">
                <h3 className="filters-title">Filters</h3>
                <div className="filters-actions">
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="clear-button">
                      Clear All
                    </button>
                  )}
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="close-button"
                  >
                    <XMarkIcon className="close-icon" />
                  </button>
                </div>
              </div>

              <div className="filters-content">
                {/* Basic Filters Row */}
                <div className="filters-row">
                  {/* Course Filter */}
                  <div className="filter-row">
                    <label className="filter-label">Course</label>
                    <Listbox
                      value={filters.course || ''}
                      onChange={(course) => updateFilters({ course: course || undefined })}
                    >
                      <div className="listbox-container">
                        <Listbox.Button className="listbox-button">
                          <span className="listbox-selected">
                            {filters.course || 'All Courses'}
                          </span>
                          <ChevronUpDownIcon className="listbox-icon" />
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="listbox-options">
                            <Listbox.Option value="" className="listbox-option">
                              All Courses
                            </Listbox.Option>
                            {availableCourses.map((course) => (
                              <Listbox.Option key={course} value={course} className="listbox-option">
                                {course}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  {/* Lecturer Filter */}
                  <div className="filter-row">
                    <label className="filter-label">Lecturer</label>
                    <Listbox
                      value={filters.lecturer || ''}
                      onChange={(lecturer) => updateFilters({ lecturer: lecturer || undefined })}
                    >
                      <div className="listbox-container">
                        <Listbox.Button className="listbox-button">
                          <span className="listbox-selected">
                            {filters.lecturer || 'All Lecturers'}
                          </span>
                          <ChevronUpDownIcon className="listbox-icon" />
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="listbox-options">
                            <Listbox.Option value="" className="listbox-option">
                              All Lecturers
                            </Listbox.Option>
                            {availableLecturers.map((lecturer) => (
                              <Listbox.Option key={lecturer} value={lecturer} className="listbox-option">
                                {lecturer}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  {/* Tags - Searchable Dropdown */}
                  {availableTags.length > 0 && (
                    <div className="filter-row">
                      <label className="filter-label">Tags</label>
                      <Combobox value={selectedTags} onChange={setSelectedTags} multiple>
                        <div className="combobox-container">
                          <Combobox.Input
                            className="combobox-input"
                            displayValue={(tags: string[]) => {
                              if (tags.length === 0) return '';
                              if (tags.length === 1) return tags[0];
                              return `${tags.length} tags selected`;
                            }}
                            onChange={(event) => setTagQuery(event.target.value)}
                            placeholder="Search and select tags..."
                          />
                          <Combobox.Button className="combobox-button">
                            <ChevronUpDownIcon className="listbox-icon" />
                          </Combobox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setTagQuery('')}
                          >
                            <Combobox.Options className="combobox-options">
                              {filteredTags.length === 0 && tagQuery !== '' ? (
                                <div className="combobox-no-results">
                                  Nothing found.
                                </div>
                              ) : (
                                filteredTags.map((tag) => (
                                  <Combobox.Option
                                    key={tag}
                                    className={({ active }) =>
                                      classNames(
                                        'combobox-option',
                                        active ? 'combobox-option-active' : ''
                                      )
                                    }
                                    value={tag}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span className={classNames(
                                          'combobox-option-text',
                                          selected ? 'font-medium' : 'font-normal'
                                        )}>
                                          {tag}
                                        </span>
                                        {selected ? (
                                          <span className="combobox-option-check">
                                            <CheckIcon className="h-5 w-5" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                      {/* Selected Tags Display - Only show when tags are selected and not searching */}
                      {selectedTags.length > 0 && !tagQuery && (
                        <div className="selected-tags">
                          {selectedTags.map((tag) => (
                            <span key={tag} className="selected-tag">
                              {tag}
                              <button
                                onClick={() => handleTagToggle(tag)}
                                className="remove-tag-button"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rating Filters Row */}
                <div className="rating-filters">
                  <div className="rating-filter">
                    <label className="filter-label">Min Difficulty</label>
                    <SpiceRating
                      value={filters.difficulty?.[0] || 1}
                      onChange={(value: number) => updateFilters({ 
                        difficulty: [value, filters.difficulty?.[1] || 5] 
                      })}
                      size="sm"
                    />
                  </div>
                  <div className="rating-filter">
                    <label className="filter-label">Min Clarity</label>
                    <SpiceRating
                      value={filters.clarity?.[0] || 1}
                      onChange={(value: number) => updateFilters({ 
                        clarity: [value, filters.clarity?.[1] || 5] 
                      })}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingSearch;
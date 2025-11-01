import React, { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { 
  ChevronUpDownIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { SearchFilters } from '../../types/index';
import SpiceRating from '../SpiceRating/SpiceRating';
import './SearchFilter.css';

interface SearchFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableCourses: string[];
  availableLecturers: string[];
  availableTags: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onFiltersChange,
  availableCourses,
  availableLecturers,
  availableTags
}) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    setSelectedTags([]);
    onFiltersChange(emptyFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined });
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="search-filter">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="clear-filters"
          >
            <XMarkIcon className="clear-icon" />
            Clear All
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* Course Filter */}
        <div className="filter-group">
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
                    {({ active, selected }) => (
                      <>
                        <span className={classNames(
                          selected ? 'font-medium' : 'font-normal',
                          'option-text'
                        )}>
                          All Courses
                        </span>
                        {selected && <CheckIcon className="option-check" />}
                      </>
                    )}
                  </Listbox.Option>
                  {availableCourses.map((course) => (
                    <Listbox.Option key={course} value={course} className="listbox-option">
                      {({ active, selected }) => (
                        <>
                          <span className={classNames(
                            selected ? 'font-medium' : 'font-normal',
                            'option-text'
                          )}>
                            {course}
                          </span>
                          {selected && <CheckIcon className="option-check" />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Lecturer Filter */}
        <div className="filter-group">
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
                    {({ active, selected }) => (
                      <>
                        <span className={classNames(
                          selected ? 'font-medium' : 'font-normal',
                          'option-text'
                        )}>
                          All Lecturers
                        </span>
                        {selected && <CheckIcon className="option-check" />}
                      </>
                    )}
                  </Listbox.Option>
                  {availableLecturers.map((lecturer) => (
                    <Listbox.Option key={lecturer} value={lecturer} className="listbox-option">
                      {({ active, selected }) => (
                        <>
                          <span className={classNames(
                            selected ? 'font-medium' : 'font-normal',
                            'option-text'
                          )}>
                            {lecturer}
                          </span>
                          {selected && <CheckIcon className="option-check" />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Difficulty Filter */}
        <div className="filter-group">
          <label className="filter-label">Minimum Difficulty</label>
          <div className="spice-filter">
            <SpiceRating
              value={filters.difficulty?.[0] || 1}
              onChange={(value) => updateFilters({ 
                difficulty: [value, filters.difficulty?.[1] || 5] 
              })}
              size="sm"
            />
          </div>
        </div>

        {/* Clarity Filter */}
        <div className="filter-group">
          <label className="filter-label">Minimum Clarity</label>
          <div className="spice-filter">
            <SpiceRating
              value={filters.clarity?.[0] || 1}
              onChange={(value) => updateFilters({ 
                clarity: [value, filters.clarity?.[1] || 5] 
              })}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="filter-group">
        <label className="filter-label">Tags</label>
        <div className="tags-container">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={classNames(
                'tag-button',
                selectedTags.includes(tag) ? 'tag-button-active' : 'tag-button-inactive'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
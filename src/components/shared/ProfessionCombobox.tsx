'use client'

import { useState, useRef, useEffect, useId, KeyboardEvent } from 'react'
import { Search, ChevronDown, X, HardHat, Check } from 'lucide-react'
import { UK_PROFESSIONS } from '@/lib/constants/professions'

interface ProfessionComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  variant?: 'default' | 'hero'
}

export function ProfessionCombobox({
  value,
  onChange,
  placeholder = 'All Professions',
  className = '',
  id,
  variant = 'default',
}: ProfessionComboboxProps) {
  const inputId = useId()
  const resolvedId = id || inputId
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const displayValue = value || ''

  const filtered = query.length >= 1
    ? UK_PROFESSIONS.filter((p) =>
        p.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : [...UK_PROFESSIONS].slice(0, 12)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
        setFocusedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
    setFocusedIndex(-1)
  }

  function handleSelect(profession: string) {
    onChange(profession === value ? '' : profession)
    setQuery('')
    setOpen(false)
    setFocusedIndex(-1)
    inputRef.current?.blur()
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
    setQuery('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true)
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && filtered[focusedIndex]) {
          handleSelect(filtered[focusedIndex])
        } else if (query && filtered.length > 0) {
          handleSelect(filtered[0])
        }
        break
      case 'Escape':
        setOpen(false)
        setQuery('')
        setFocusedIndex(-1)
        break
    }
  }

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input trigger */}
      <div
        className={`flex items-center gap-2 cursor-pointer ${
          isHero
            ? 'px-4 py-3'
            : 'px-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all'
        }`}
        onClick={() => { setOpen(true); inputRef.current?.focus() }}
      >
        <HardHat className={`shrink-0 w-4 h-4 ${isHero ? 'text-blue-400' : 'text-slate-400'}`} />
        <input
          ref={inputRef}
          id={resolvedId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${resolvedId}-list`}
          aria-activedescendant={focusedIndex >= 0 ? `${resolvedId}-opt-${focusedIndex}` : undefined}
          value={open ? query : displayValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value ? value : placeholder}
          className={`flex-1 min-w-0 bg-transparent outline-none text-sm font-medium ${
            isHero
              ? 'text-slate-800 placeholder:text-slate-400'
              : 'text-slate-700 placeholder:text-slate-400'
          }`}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear profession"
            onClick={handleClear}
            className="shrink-0 text-slate-300 hover:text-slate-600 transition-colors p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className={`shrink-0 w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isHero ? 'text-slate-400' : 'text-slate-300'}`} />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={`${resolvedId}-list`}
          role="listbox"
          aria-label="Professions"
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-y-auto max-h-64 py-1.5 animate-fade-in-down"
          style={{ minWidth: 220 }}
        >
          {/* "All" option */}
          <li
            role="option"
            aria-selected={!value}
            id={`${resolvedId}-opt-all`}
            onClick={() => handleSelect('')}
            className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
              !value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span>All Professions</span>
            {!value && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
          </li>

          <div className="h-px bg-slate-100 mx-3 my-1" />

          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-400 text-center">
              No matches for &ldquo;{query}&rdquo;
            </li>
          ) : (
            filtered.map((profession, i) => {
              const isSelected = value === profession
              const isFocused = focusedIndex === i
              return (
                <li
                  key={profession}
                  id={`${resolvedId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(profession)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700'
                      : isFocused
                      ? 'bg-slate-50 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 prof-default">
                    {profession.charAt(0)}
                  </span>
                  <span className="flex-1">{profession}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

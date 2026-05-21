'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { MapPin, X, Navigation } from 'lucide-react'

const UK_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
  'Liverpool', 'Sheffield', 'Bristol', 'Edinburgh', 'Leicester',
  'Coventry', 'Bradford', 'Nottingham', 'Cardiff', 'Belfast',
  'Newcastle upon Tyne', 'Sunderland', 'Derby', 'Southampton',
  'Portsmouth', 'Oxford', 'Cambridge', 'Luton', 'Reading',
  'Aberdeen', 'Milton Keynes', 'Stoke-on-Trent', 'Wolverhampton',
  'Plymouth', 'Swansea', 'Salford', 'Bournemouth', 'Exeter',
]

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  variant?: 'default' | 'hero'
}

export function LocationInput({
  value,
  onChange,
  placeholder = 'Location (e.g. London)',
  className = '',
  id,
  variant = 'default',
}: LocationInputProps) {
  const inputId = useId()
  const resolvedId = id || inputId
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const suggestions = value.length >= 1
    ? UK_CITIES.filter((c) => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 8)
    : UK_CITIES.slice(0, 8)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      const item = listRef.current.children[focused] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [focused])

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 ${
          isHero
            ? 'px-4 py-3'
            : 'px-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all'
        }`}
      >
        <MapPin className={`shrink-0 w-4 h-4 ${isHero ? 'text-blue-400' : 'text-slate-400'}`} />
        <input
          ref={inputRef}
          id={resolvedId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${resolvedId}-list`}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setFocused(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open && e.key === 'ArrowDown') { setOpen(true); return }
            switch (e.key) {
              case 'ArrowDown': e.preventDefault(); setFocused((i) => Math.min(i + 1, suggestions.length - 1)); break
              case 'ArrowUp':   e.preventDefault(); setFocused((i) => Math.max(i - 1, 0)); break
              case 'Enter':
                e.preventDefault()
                if (focused >= 0 && suggestions[focused]) {
                  onChange(suggestions[focused]); setOpen(false); setFocused(-1)
                }
                break
              case 'Escape': setOpen(false); setFocused(-1); break
            }
          }}
          placeholder={placeholder}
          className={`flex-1 min-w-0 bg-transparent outline-none text-sm font-medium ${
            isHero ? 'text-slate-800 placeholder:text-slate-400' : 'text-slate-700 placeholder:text-slate-400'
          }`}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear location"
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            className="shrink-0 text-slate-300 hover:text-slate-600 transition-colors p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <ul
          ref={listRef}
          id={`${resolvedId}-list`}
          role="listbox"
          aria-label="UK cities"
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-y-auto max-h-64 py-1.5 animate-fade-in-down"
          style={{ minWidth: 200 }}
        >
          {/* Header */}
          <li className="px-4 py-1.5 flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UK Cities</span>
          </li>

          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-400">
              No city matches — type your area name
            </li>
          ) : (
            suggestions.map((city, i) => (
              <li
                key={city}
                id={`${resolvedId}-city-${i}`}
                role="option"
                aria-selected={value === city}
                onClick={() => { onChange(city); setOpen(false); setFocused(-1) }}
                className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
                  value === city
                    ? 'bg-blue-50 text-blue-700'
                    : focused === i
                    ? 'bg-slate-50 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {city}
              </li>
            ))
          )}

          {value && !UK_CITIES.includes(value) && (
            <>
              <div className="h-px bg-slate-100 mx-3 my-1" />
              <li
                role="option"
                aria-selected={false}
                onClick={() => { setOpen(false) }}
                className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Search &ldquo;<strong>{value}</strong>&rdquo;
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  )
}

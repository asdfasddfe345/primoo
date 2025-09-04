'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search jobs, companies, or skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 md:w-[300px] lg:w-[400px]"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1 h-8"
      >
        Search
      </Button>
    </form>
  )
}
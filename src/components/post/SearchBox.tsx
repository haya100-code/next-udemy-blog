'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function SearchBox() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();

  // デバウンス（高頻度に呼び出されるのを防ぐ 500ms後に実行
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // debouncedSearchが更新されたら実行
  useEffect(() => {
    if(debouncedSearch.trim()){
      router.push(`/?search=${debouncedSearch.trim()}`)
    } else {
      router.push('/')
    }
  })

  return(
  <Input
    placeholder="記事を検索..."
    className="w-50 lg:w-75"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  )

}
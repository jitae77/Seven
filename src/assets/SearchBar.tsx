import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { dataSeven as data } from "./DataSeven"
import "./SearchBar.css"

interface SearchBarProps {
  onActiveChange?: (active: boolean) => void
}

export default function SearchBar({ onActiveChange }: SearchBarProps) {
  const [input, setInput] = useState("")
  const [filter, setFilter] = useState({
    type: "",
    statut: "",
    sort: "date",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isActive, setIsActive] = useState(false)

  const resultsPerPage = 6
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const normalize = (str: string) =>
    str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .toLowerCase()
      .trim() || ""

  const fuzzyMatch = (text: string, query: string): boolean => {
    const words = normalize(query).split(/\s+/)
    const target = normalize(text)
    return words.every((w) => target.includes(w))
  }

  const handleClose = useCallback(
    (opts?: { keepInput?: boolean }) => {
      if (!opts?.keepInput) {
        setInput("")
        setFilter({ type: "", statut: "", sort: "date" })
      }
      setCurrentPage(1)
      setIsActive(false)
      document.body.classList.remove("blur-active")
      onActiveChange?.(false)
      inputRef.current?.blur()
    },
    [onActiveChange]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose({ keepInput: true })
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClose])

  useEffect(() => {
    if (isActive) document.body.classList.add("blur-active")
    else document.body.classList.remove("blur-active")
    onActiveChange?.(isActive)
  }, [isActive])

  const filteredResults = useMemo(() => {
    if (!input.trim()) return []

    let results = data.filter(
      (item) =>
        fuzzyMatch(item.titre, input) ||
        fuzzyMatch(item.description, input) ||
        fuzzyMatch(item.auteur, input)
    )

    if (filter.type) results = results.filter((i) => i.type === filter.type)
    if (filter.statut) results = results.filter((i) => i.statut === filter.statut)

    const sorted = [...results]
    sorted.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

    return sorted
  }, [input, filter])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / resultsPerPage))
  const startIndex = (currentPage - 1) * resultsPerPage
  const currentResults = filteredResults.slice(startIndex, startIndex + resultsPerPage)

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const total = totalPages
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i)
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", total)
    } else if (currentPage >= total - 2) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", total)
    }
    return pages
  }

  const truncate = (text: string, max = 120) =>
    !text ? "" : text.length > max ? text.slice(0, max).trimEnd() + "…" : text

  return (
    <>
      {isActive && <div className="search-blur-overlay" />}
      <div
        ref={containerRef}
        className={`search-container ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(true)}
      >
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="   Rechercher un manga, manhwa ou anime..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input && (
            <button
              className="reset-btn reset-x"
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              title="Fermer"
            >
              ✖
            </button>
          )}
        </div>

        {isActive && (
          <>
            <div className="filters" onClick={(e) => e.stopPropagation()}>
              <select
                className={filter.type ? "active-tag" : ""}
                value={filter.type}
                onChange={(e) => setFilter((s) => ({ ...s, type: e.target.value }))}
              >
                <option value="">Tous les types</option>
                <option value="Manga">Manga</option>
                <option value="Manhwa">Manhwa</option>
                <option value="Anime">Anime</option>
              </select>

              <select
                className={filter.statut ? "active-tag" : ""}
                value={filter.statut}
                onChange={(e) => setFilter((s) => ({ ...s, statut: e.target.value }))}
              >
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Pause">Pause</option>
              </select>
            </div>

            <div className="search-results" onClick={(e) => e.stopPropagation()}>
              {currentResults.length > 0 ? (
                currentResults.map((item) => (
                  <a
                    key={item.id}
                    href={item.lien}
                    className="manhua-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="image-wrapper">
                      <img
                        src={item.image || "placeholder.jpg"}
                        alt={item.titre}
                        className="manhua-image"
                      />
                    </div>
                    <div className="manhua-info">
                      <h3 className="manhua-title">{item.titre}</h3>
                      <p className="manhua-description">{truncate(item.description)}</p>

                      <div className="manhua-tags bottom">
                        <span className={`tag tag-type ${item.type.toLowerCase()}`}>{item.type}</span>
                        <span
                          className={`tag tag-statut ${item.statut
                            .replace(/\s/g, "")
                            .toLowerCase()}`}
                        >
                          {item.statut}
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <p className="no-results">Aucun résultat trouvé...</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination" onClick={(e) => e.stopPropagation()}>
                {getVisiblePages().map((page, idx) =>
                  page === "..." ? (
                    <span key={`dots-${idx}`} className="page-dots">
                      …
                    </span>
                  ) : (
                    <button
                      key={`page-${idx}`}
                      className={`page-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(Number(page))}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}


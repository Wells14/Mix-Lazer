import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Parser } from 'json2csv'
import * as XLSX from 'xlsx'

interface ExportButtonProps {
  data: any[]
  filename: string
  format: 'csv' | 'xlsx'
  className?: string
  loading?: boolean
}

export function ExportButton({
  data,
  filename,
  format,
  className,
  loading = false,
}: ExportButtonProps) {
  const handleExport = () => {
    if (format === 'csv') {
      try {
        const parser = new Parser()
        const csv = parser.parse(data)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${filename}.csv`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } catch (err) {
        console.error('Error exporting CSV:', err)
      }
    } else if (format === 'xlsx') {
      try {
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
        XLSX.writeFile(wb, `${filename}.xlsx`)
      } catch (err) {
        console.error('Error exporting XLSX:', err)
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className={cn("", className)}
    >
      {loading ? (
        "Exportando..."
      ) : (
        `Exportar ${format.toUpperCase()}`
      )}
    </Button>
  )
}

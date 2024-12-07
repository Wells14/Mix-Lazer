import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  title: string
  width?: number
  render?: (value: any, row: any) => React.ReactNode
}

interface TableCardProps {
  title: string
  columns: Column[]
  data: any[]
  description?: string
  className?: string
  action?: React.ReactNode
  loading?: boolean
}

export function TableCard({
  title,
  columns,
  data,
  description,
  className,
  action,
  loading = false,
}: TableCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {title}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Nenhum dado encontrado
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="p-4 align-middle"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

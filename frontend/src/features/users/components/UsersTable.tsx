import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import type { GridColDef, GridPaginationModel, GridFilterModel, GridSortModel } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import { useGetApiUsers } from '../../../api/generated'

function SoftToolbar() {
  return (
    <Box sx={(t) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1,
      px: { xs: 1, md: 1.5 },
      py: 1,
      borderBottom: `1px solid ${t.palette.divider}`,
      backgroundColor: t.palette.background.paper,
    })}>
      <Box sx={{ width: { xs: '100%', sm: 320 } }}>
        <GridToolbarQuickFilter
          quickFilterParser={(val) => val.split(/\s+/).filter(Boolean)}
          debounceMs={300}
        />
      </Box>
      <Box sx={{ flex: 1 }} />
    </Box>
  )
}

type Row = { id: string; email: string; fullName: string; createdUtc?: string }

export function UsersTable() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  // Keep filter model controlled to read quick filter value for server search
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] })

  const params = useMemo(() => {
    const quick = filterModel.quickFilterValues?.[0] ?? ''
    return {
      search: quick || undefined,
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
    }
  }, [filterModel, paginationModel])

  const query = useGetApiUsers(params, { query: { staleTime: 30000 } })

  const rows: Row[] = (query.data?.data.items ?? []).map((u) => ({ id: u.id!, email: u.email ?? '', fullName: u.name ?? '', createdUtc: u.createdUtc }))
  const rowCount = query.data?.data.total ?? 0

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        renderCell: (p) => (
          <a href={`mailto:${p.value as string}`} style={{ color: 'inherit' }}>
            {p.value as string}
          </a>
        ),
      },
      { field: 'fullName', headerName: 'Name', flex: 1 },
      {
        field: 'createdUtc',
        headerName: 'Created',
        flex: 1,
        valueFormatter: (p: { value?: string }) => (p.value ? new Date(p.value).toLocaleString() : ''),
      },
    ],
    []
  )

  // React Query refetches automatically when `params` changes
  console.log(rows, query.data?.data.items)
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        autoHeight
        columnHeaderHeight={44}
        rowHeight={44}
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        loading={query.isFetching}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={(model) => {
          setFilterModel(model)
          setPaginationModel((prev) => ({ ...prev, page: 0 }))
        }}
        sortingMode="client"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        disableRowSelectionOnClick
        disableColumnMenu
        slots={{ toolbar: SoftToolbar }}
        density="compact"
        sx={(t) => ({
          '--DataGrid-containerBackground': 'transparent',
          '--DataGrid-cellPaddingInline': '14px',
          '--DataGrid-cellPaddingBlock': '10px',
          border: `1px solid ${t.palette.divider}`,
          overflow: 'hidden',
          backgroundColor: t.palette.background.paper,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: t.palette.background.default,
            borderBottom: `1px solid ${t.palette.divider}`,
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: 'text.secondary',
            },
          },
          '& .MuiDataGrid-virtualScrollerRenderZone': {
            '& .MuiDataGrid-row': {
              borderBottom: `1px solid ${t.palette.divider}`,
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.03)',
          },
          '& .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row:nth-of-type(odd) .MuiDataGrid-cell': {
            backgroundColor: 'rgba(2, 6, 23, 0.015)',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: `1px solid ${t.palette.divider}`,
            backgroundColor: t.palette.background.paper,
          },
        })}
      />
    </Box>
  )
}



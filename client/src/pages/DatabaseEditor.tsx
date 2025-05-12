import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Database, Table as TableIcon, FileText } from "lucide-react";
import { Link } from "wouter";

interface TableInfo {
  table_name: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface TableData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface QueryResult {
  rows: any[];
  rowCount: number;
}

const DatabaseEditor = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableColumns, setTableColumns] = useState<ColumnInfo[]>([]);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tables");
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchTables();
    }
  }, [isAuthenticated, user]);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/db/tables");
      if (!response.ok) throw new Error("Failed to fetch tables");
      
      const data = await response.json();
      setTables(data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch database tables",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchTableSchema = async (tableName: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/db/tables/${tableName}/schema`);
      if (!response.ok) throw new Error("Failed to fetch table schema");
      
      const data = await response.json();
      setTableColumns(data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch table schema",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchTableData = async (tableName: string, page: number = 1, size: number = 10) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/db/tables/${tableName}/data?page=${page}&pageSize=${size}`);
      if (!response.ok) throw new Error("Failed to fetch table data");
      
      const data = await response.json();
      setTableData(data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch table data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentPage(1);
    fetchTableSchema(tableName);
    fetchTableData(tableName, 1, pageSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (selectedTable) {
      fetchTableData(selectedTable, page, pageSize);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value);
    setPageSize(newSize);
    setCurrentPage(1);
    if (selectedTable) {
      fetchTableData(selectedTable, 1, newSize);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a SQL query",
        variant: "default",
      });
      return;
    }
    
    try {
      setIsQueryLoading(true);
      const response = await fetch("/api/admin/db/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to execute query");
      }
      
      const data = await response.json();
      setQueryResult(data);
      setIsQueryLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute query",
        variant: "destructive",
      });
      setIsQueryLoading(false);
    }
  };

  // Check for admin access
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need administrator privileges to access this page.
          </p>
          <Link href="/">
            <Button>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    if (!tableData || !tableData.pagination) return null;
    
    const { page, totalPages } = tableData.pagination;
    
    const items = [];
    
    // Previous Button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => page > 1 && handlePageChange(page - 1)}
          className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    // Page numbers
    const maxPages = 5;
    const startPage = Math.max(1, page - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={page === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next Button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => page < totalPages && handlePageChange(page + 1)}
          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    return (
      <Pagination>
        <PaginationContent>{items}</PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Database Editor</h1>
          <p className="text-muted-foreground">
            View and query database tables for debugging and administration.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={fetchTables}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Tables
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables">
            <TableIcon className="mr-2 h-4 w-4" />
            Tables Explorer
          </TabsTrigger>
          <TabsTrigger value="sql">
            <Database className="mr-2 h-4 w-4" />
            SQL Query
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tables</CardTitle>
              <CardDescription>
                Select a table to view its schema and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !selectedTable ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {tables.map((table) => (
                      <Button 
                        key={table.table_name}
                        variant={selectedTable === table.table_name ? "default" : "outline"}
                        onClick={() => handleTableSelect(table.table_name)}
                        className="justify-start"
                      >
                        <TableIcon className="mr-2 h-4 w-4" />
                        {table.table_name}
                      </Button>
                    ))}
                  </div>

                  {selectedTable && (
                    <div className="mt-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-xl font-semibold mb-2 md:mb-0">
                          Table: {selectedTable}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Rows per page:</span>
                          <Select
                            value={pageSize.toString()}
                            onValueChange={handlePageSizeChange}
                          >
                            <SelectTrigger className="w-[70px]">
                              <SelectValue placeholder={pageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="rounded-md border mb-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Column Name</TableHead>
                              <TableHead>Data Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Default Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableColumns.map((column) => (
                              <TableRow key={column.column_name}>
                                <TableCell className="font-medium">{column.column_name}</TableCell>
                                <TableCell>{column.data_type}</TableCell>
                                <TableCell>{column.is_nullable === 'YES' ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{column.column_default || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : tableData && tableData.data.length > 0 ? (
                        <>
                          <div className="rounded-md border mb-4 overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(tableData.data[0]).map((key) => (
                                    <TableHead key={key}>{key}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tableData.data.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {Object.values(row).map((value: any, cellIndex) => (
                                      <TableCell key={cellIndex}>
                                        {value === null ? (
                                          <span className="text-muted-foreground italic">NULL</span>
                                        ) : typeof value === 'object' ? (
                                          <span className="text-muted-foreground italic">
                                            {JSON.stringify(value).substring(0, 100)}
                                            {JSON.stringify(value).length > 100 ? '...' : ''}
                                          </span>
                                        ) : typeof value === 'boolean' ? (
                                          value.toString()
                                        ) : (
                                          String(value).substring(0, 100) + 
                                          (String(value).length > 100 ? '...' : '')
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-muted-foreground">
                              Showing {tableData.data.length} of {tableData.pagination.totalCount} entries
                            </div>
                            {renderPagination()}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No data found in this table
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sql" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query</CardTitle>
              <CardDescription>
                Run SQL queries on the database (SELECT queries only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="SELECT * FROM users LIMIT 10;"
                  className="font-mono min-h-[150px]"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                />
                <Button 
                  onClick={executeQuery} 
                  disabled={isQueryLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isQueryLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Execute Query
                </Button>
                
                {isQueryLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : queryResult ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Results ({queryResult.rowCount} rows)
                    </h3>
                    {queryResult.rows.length > 0 ? (
                      <div className="rounded-md border mb-4 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(queryResult.rows[0]).map((key) => (
                                <TableHead key={key}>{key}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {queryResult.rows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {Object.values(row).map((value: any, cellIndex) => (
                                  <TableCell key={cellIndex}>
                                    {value === null ? (
                                      <span className="text-muted-foreground italic">NULL</span>
                                    ) : typeof value === 'object' ? (
                                      <span className="text-muted-foreground italic">
                                        {JSON.stringify(value).substring(0, 100)}
                                        {JSON.stringify(value).length > 100 ? '...' : ''}
                                      </span>
                                    ) : typeof value === 'boolean' ? (
                                      value.toString()
                                    ) : (
                                      String(value).substring(0, 100) + 
                                      (String(value).length > 100 ? '...' : '')
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground rounded-md border">
                        Query returned no results
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseEditor;
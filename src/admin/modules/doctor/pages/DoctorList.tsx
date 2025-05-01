import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import PageHeader from '@/admin/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Doctor } from '../types/Doctor';
import DoctorService from '../services/doctorService';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from '@/lib/utils';
import { MedicalCouncil } from '../types/MedicalCouncil';
import ReviewDoctorDialog from '../components/ReviewDoctorDialog';

const DoctorList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, [page, perPage]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await DoctorService.getPaginatedDoctors(page, perPage);
      setDoctors(response.content);
      setTotal(response.totalElements);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to the first page when changing the number of items per page
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleReviewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowReviewDialog(true);
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <PageHeader
          title="Doctors"
          showAddButton
          addButtonLabel="Add Doctor"
          onAddButtonClick={() => toast({
            title: "Add Doctor",
            description: "This feature is coming soon.",
          })}
        />
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search doctors..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="mt-6 bg-white border shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows for loading state
                [...Array(perPage)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium"><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px] mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : (
                // Doctor data rows
                doctors.map((doctor, index) => {
                  const externalLabel = doctor.external ? 'External' : 'Internal';

                  return (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{index + 1 + (page - 1) * perPage}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="Doctor Avatar" />
                            <AvatarFallback>{getInitials(doctor.firstname + ' ' + doctor.lastname)}</AvatarFallback>
                          </Avatar>
                          <div>
                            {doctor.firstname} {doctor.lastname}
                            {doctor.specializationList && doctor.specializationList.length > 0 && (
                              <div className="text-xs text-gray-600">
                                Specialization: {doctor.specializationList.map(spec => spec.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.phone}</TableCell>
                      <TableCell>
                        {doctor.specializationList && doctor.specializationList.map((item) => (
                          <Badge key={item.id} variant="secondary" className="mr-1">{item.name}</Badge>
                        ))}
                      </TableCell>
                      <TableCell>
                        {doctor.verified ? (
                          <Badge variant="outline">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleReviewDoctor(doctor)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/doctors/edit/${doctor.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-y-4 mt-4">
          <div>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationPrevious href="#" onClick={() => handlePageChange(page - 1)} aria-disabled={page === 1} />
              {/* Display page numbers */}
              {Array.from({ length: Math.ceil(total / perPage) }, (_, i) => i + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber} className={cn({
                  "is-active": pageNumber === page,
                })}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(pageNumber)}
                    className={cn({
                      "is-active": pageNumber === page,
                    })}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} aria-disabled={page === Math.ceil(total / perPage)} />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <ReviewDoctorDialog open={showReviewDialog} onOpenChange={setShowReviewDialog} doctor={selectedDoctor} />
    </AdminLayout>
  );
};

export default DoctorList;

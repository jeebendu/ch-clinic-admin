
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/admin/components/PageHeader";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoginHistory } from "../types/LoginHistory";
import { FilterOption } from "@/admin/components/FilterCard";
import { useQuery } from "@tanstack/react-query";
import LoginHistoryService from "../service/LoginHistoryService";
import LoginHistoryTable from "../components/LoginHistoryTable";
import { ClipboardList } from "lucide-react";

const LoginHistoryList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const isMobile = useIsMobile();

    const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
    const [searchTerm, setSearchTerm] = useState<{
        mobile?: string;
        status?: boolean;
        datefrom?: Date;
        value?: string;
    }>({
        mobile: null,
        status: null,
        datefrom: null,
        value: "",
    });
    const [page, setPage] = useState<number>(0); // Start with page 0
    const [size, setSize] = useState<number>(10); // Initial page size
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    const fetchLoginInfo = useCallback(async () => {
        try {
            const response = await LoginHistoryService.filter(page, size, searchTerm);
            setLoginHistory((prevHistory) => [...prevHistory, ...response.data.content]);
            setTotalElements(response.data.totalElements);
            console.log("Login History API response:", response.data);
            setLoadingMore(false);
        } catch (error) {
            console.error("Error fetching login history:", error);
            toast({ title: "Error", description: "Failed to fetch login history" });
            setLoadingMore(false);
        }
    }, [page, size, searchTerm, toast]);

    useEffect(() => {
        // Initial data fetch
        fetchLoginInfo();
    }, [fetchLoginInfo]);

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && loginHistory.length < totalElements) {
            setLoadingMore(true);
            setPage((prevPage) => prevPage + 1);
        }
    }, [loadingMore, loginHistory.length, totalElements, setPage]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && // Adjust the threshold as needed
                !loadingMore &&
                loginHistory.length < totalElements
            ) {
                handleLoadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleLoadMore, loadingMore, loginHistory.length, totalElements]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <PageHeader 
                    title="Login History" 
                    description="View all user login sessions"
                    icon={<ClipboardList className="h-5 w-5" />}
                    onRefreshClick={fetchLoginInfo}
                    loadedElements={loginHistory.length}
                    totalElements={totalElements}
                />
                
                {loginHistory.length === 0 && !loadingMore ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 border rounded-lg bg-gray-50">
                        <ClipboardList className="h-16 w-16 text-gray-300" />
                        <p className="text-muted-foreground">No login history available.</p>
                    </div>
                ) : (
                    <div className="rounded-md border bg-white shadow-sm">
                        <LoginHistoryTable
                            loginHistory={loginHistory}
                        />
                        {loadingMore && (
                            <div className="flex justify-center p-4 border-t">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                                    <p className="text-sm text-muted-foreground">Loading more login history...</p>
                                </div>
                            </div>
                        )}
                        {loginHistory.length >= totalElements && totalElements > 0 && (
                            <div className="py-4 text-center text-sm text-muted-foreground border-t">
                                No more login history to load.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default LoginHistoryList;

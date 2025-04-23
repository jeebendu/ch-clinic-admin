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
            <div>
                
                <div>
                    <LoginHistoryTable
                        loginHistory={loginHistory}
                    />
                    {loadingMore && <div>Loading more login history...</div>}
                    {loginHistory.length >= totalElements && totalElements > 0 && <div>No more login history to load.</div>}
                </div>
                
            </div>
        </AdminLayout>
    );
};

export default LoginHistoryList;
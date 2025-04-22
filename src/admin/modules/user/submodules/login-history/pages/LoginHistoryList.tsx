
import React, { useEffect, useState } from "react";
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

  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>();
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
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();




  const fetchLoginInfo = async () => {
    try {
      const response = await LoginHistoryService.filter(page, size, searchTerm);
      setLoginHistory(response.data.content);
      console.log("User API response (direct):", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching login history:", error);
      toast({ title: "Error", description: "Failed to fetch login history" });
    }
  };

  useEffect(() => {
    fetchLoginInfo();
  }, [page, size, searchTerm]); // Added dependencies to re-fetch data when these values change




  // const totalElements = filteredUsers.length || 0;
  // const loadedElements = filteredUsers.length || 0;

  return (
    <AdminLayout>
      <div>
        (
        <div>

          <LoginHistoryTable
            loginHistory={loginHistory}

          />

        </div>
        )
      </div>

    </AdminLayout>
  );
};

export default LoginHistoryList;

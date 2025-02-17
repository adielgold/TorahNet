import React, { useEffect, useState } from "react";
import withAuth from "@/components/withAuth/withAuth";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import LayoutWrapper from "@/components/Layout";
import { Grid, Paper, Box, Typography, Chip, Stack } from '@mui/material';
import ToggleButtonsComponent, { ToggleButtonItem } from "@/components/ToggleButtons/ToggleButtons";
import { StyledAdminPanelBoxContainer } from "@/styles/components/AdminPanel";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from 'ag-charts-community';


const timeToggleItems: ToggleButtonItem[] = [
    {label: 'Today', value: 'DAY'},
    {label: 'This Week', value: 'WEEK'},
    {label: 'This Month', value: 'MONTH'}
]


const Profile = () => {
  const { user } = useUserStore();

  const supabase = createClient();

  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [recentUsers, setRecentUsers] = useState<Array<{ created_at: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [popularTopics, setPopularTopics] = useState<string[]>([]);
  const [roleData, setRoleData] = useState<{role: string, count: number}[]>([]);
  const [monthlyUserData, setMonthlyUserData] = useState<{ month: string, count: number }[]>([]);



  useEffect(() => {
    const fetchRecentUsers = async () => {
      setIsLoading(true);
      try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const { data, error } = await supabase
          .from("users")
          .select("created_at")
          .gte("created_at", oneMonthAgo.toISOString())
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRecentUsers(data || []);
      } catch (error) {
        console.error("Error fetching recent users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  useEffect(() => {
    const now = new Date();
    let startDate = new Date();
  
    switch (selectedTimeRange) {
      case "DAY":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "WEEK":
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "MONTH":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }
    
    const count = recentUsers.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt >= startDate;
    }).length;
  
    setNewUsersCount(count);
  }, [selectedTimeRange, recentUsers]);
  
  useEffect(() => {
    const fetchPopularTopics = async () => {
      const { data, error } = await supabase.rpc("get_popular_topics");
    
      if (error) {
        console.error("Error fetching popular topics:", error);
        return;
      }
    
      setPopularTopics(data);
    };
  
    fetchPopularTopics();
  }, []);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("role");
    
        if (error) throw error;
    
        const validUsers = data.filter((user) => user.role !== null);
    
        const roleCounts = validUsers.reduce((acc: Record<string, number>, user) => {
          const role = user.role as string;
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
    
        const formattedData = Object.keys(roleCounts).map((role) => ({
          role,
          count: roleCounts[role],
        }));
    
        setRoleData(formattedData);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };
    
    fetchUserRoles();
  }, []);

  useEffect(() => {
    const fetchUsersByMonth = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months (current month included)
  
        const { data, error } = await supabase
          .from("users")
          .select("created_at");
  
        if (error) throw error;
  
        // Create a map to count users per month
        const userCounts = new Map();
  
        // Initialize last 6 months with 0 counts
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          userCounts.set(key, 0);
        }
  
        // Count users per month
        data.forEach(user => {
          const date = new Date(user.created_at);
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (userCounts.has(key)) {
            userCounts.set(key, userCounts.get(key) + 1);
          }
        });
  
        // Convert map to array for the chart
        const formattedData = Array.from(userCounts.entries()).map(([month, count]) => ({
          month,
          count,
        }));
  
        setMonthlyUserData(formattedData);
      } catch (error) {
        console.error("Error fetching users by month:", error);
      }
    };
  
    fetchUsersByMonth();
  }, []);  


  const userRolesOptions: AgChartOptions = {
    data: roleData,
    series: [
      {
        type: "donut",
        calloutLabelKey: "role",
        angleKey: "count",
        innerRadiusRatio: 0.7,
        cornerRadius: 3,
      },
    ],
    title: {
      text: "User Roles",
      color: "#1e1e4a",
      fontWeight: "bold",
    },
  };

  const barChartOptions: AgChartOptions = {
    data: monthlyUserData,
    series: [
      {
        type: "bar",
        xKey: "month",
        yKey: "count",
        label: {
          enabled: true,
        },
        cornerRadius: 10,
      },
    ],
    title: {
      text: "New Users Per Month",
      color: "#1e1e4a",
      fontWeight: "bold",
    },
  };
  


  return user?.role === 'admin' ? (
    <LayoutWrapper>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <ToggleButtonsComponent items={timeToggleItems} onChange={setSelectedTimeRange} defaultValue="DAY" />
      </div>

      <Box sx={{ flexGrow: 1, marginBottom: "30px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledAdminPanelBoxContainer>
                <Typography fontSize="18px" fontWeight="bold" color="#1e1e4a" marginBottom="15px">New registrations</Typography>
                <Typography fontSize="20px" fontWeight="bold" color="#1e1e4a">{newUsersCount} new users</Typography>
              </StyledAdminPanelBoxContainer>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledAdminPanelBoxContainer>
              <Typography fontSize="18px" fontWeight="bold" color="#1e1e4a" marginBottom="15px">Popular Topics</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {popularTopics.map((topic, index) => (
                  <Chip key={index} label={topic} variant="outlined"/>
                ))}
              </Stack>
              </StyledAdminPanelBoxContainer>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <StyledAdminPanelBoxContainer>
              <Typography fontSize="18px" fontWeight="bold" color="#1e1e4a" marginBottom="15px">Revenue</Typography>
              <Typography fontSize="20px" fontWeight="bold" color="#1e1e4a">-- Not calculated yet --</Typography>
              </StyledAdminPanelBoxContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    <Stack direction="row" justifyContent="space-between" gap="20px">
      <StyledAdminPanelBoxContainer>
        <AgCharts options={userRolesOptions} />
      </StyledAdminPanelBoxContainer>
      <StyledAdminPanelBoxContainer>
        <AgCharts options={barChartOptions} />
      </StyledAdminPanelBoxContainer>
    </Stack>
    </LayoutWrapper>
  ) : null;
};

export default withAuth(Profile);

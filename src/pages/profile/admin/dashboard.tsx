import React, { use, useCallback, useEffect, useState } from "react";
import withAuth from "@/components/withAuth/withAuth";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import LayoutWrapper from "@/components/Layout";
import { Grid, Paper, Box, Typography, Chip, Stack } from '@mui/material';
import ToggleButtonsComponent, { ToggleButtonItem } from "@/components/ToggleButtons/ToggleButtons";
import { StyledAdminPanelBoxContainer } from "@/styles/components/AdminPanel";

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


  return user?.role === 'admin' ? (
    <LayoutWrapper>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <ToggleButtonsComponent items={timeToggleItems} onChange={setSelectedTimeRange} defaultValue="DAY" />
      </div>

      <Box sx={{ flexGrow: 1 }}>
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
                Content Box 5
              </StyledAdminPanelBoxContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    </LayoutWrapper>
  ) : null;
};

export default withAuth(Profile);

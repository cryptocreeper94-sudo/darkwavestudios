import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Megaphone, 
  Instagram, 
  Facebook, 
  Calendar,
  Plus,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Zap,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const ADMIN_KEY = "0424";

interface MarketingPost {
  id: string;
  tenantId: string;
  content: string;
  platform: string;
  hashtags: string[] | null;
  imageFilename: string | null;
  isActive: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

interface IntegrationStatus {
  facebookConnected: boolean;
  instagramConnected: boolean;
  twitterConnected: boolean;
  facebookPageName?: string;
  instagramUsername?: string;
  twitterUsername?: string;
}

interface ScheduledPost {
  id: string;
  platform: string;
  content: string;
  imageUrl: string | null;
  scheduledFor: string;
  status: string;
  postedAt: string | null;
}

interface MarketingImage {
  id: string;
  tenantId: string;
  filename: string;
  filePath: string;
  category: string | null;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export default function MarketingHub() {
  const [activeTab, setActiveTab] = useState<"library" | "calendar" | "analytics" | "images">("library");
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newPlatform, setNewPlatform] = useState("all");
  const [newHashtags, setNewHashtags] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [generatedPosts, setGeneratedPosts] = useState<Array<{ content: string; hashtags: string[] }>>([]);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeCompany, setSubscribeCompany] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
  const [uploadCategory, setUploadCategory] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/marketing/posts"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/posts", {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    }
  });

  const { data: integration } = useQuery({
    queryKey: ["/api/marketing/integration"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/integration", {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json() as Promise<IntegrationStatus>;
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; platform: string; hashtags: string[] }) => {
      const res = await fetch("/api/marketing/posts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Admin-Key": ADMIN_KEY 
        },
        body: JSON.stringify({ ...data, tenantId: "darkwave" })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/posts"] });
      setShowNewPost(false);
      setNewContent("");
      setNewPlatform("all");
      setNewHashtags("");
      toast({ title: "Post created", description: "Content added to library" });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/marketing/posts/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/posts"] });
      toast({ title: "Post deleted" });
    }
  });

  const postNowMutation = useMutation({
    mutationFn: async (data: { content: string; platform: string }) => {
      const res = await fetch("/api/marketing/post-now", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Admin-Key": ADMIN_KEY 
        },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Posted!", description: `Post ID: ${data.externalId}` });
      } else {
        toast({ title: "Post failed", description: data.error, variant: "destructive" });
      }
    }
  });

  const generateAIMutation = useMutation({
    mutationFn: async (data: { topic: string; tone: string }) => {
      const res = await fetch("/api/marketing/generate-content", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Admin-Key": ADMIN_KEY 
        },
        body: JSON.stringify({ ...data, count: 3 })
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.posts) {
        setGeneratedPosts(data.posts);
        toast({ title: "Content generated!", description: `${data.posts.length} posts created` });
      } else {
        toast({ title: "Generation failed", description: data.error, variant: "destructive" });
      }
    }
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: { plan: string; email: string; companyName: string }) => {
      const res = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Checkout failed", description: data.error, variant: "destructive" });
      }
    }
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/marketing/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/analytics", {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    }
  });

  const { data: scheduledData } = useQuery({
    queryKey: ["/api/marketing/scheduled", calendarWeekOffset],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (calendarWeekOffset * 7));
      startDate.setHours(0, 0, 0, 0);
      const res = await fetch(`/api/marketing/scheduled?from=${startDate.toISOString()}`, {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    }
  });

  const { data: imagesData } = useQuery({
    queryKey: ["/api/marketing/images"],
    queryFn: async () => {
      const res = await fetch("/api/marketing/images", {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/marketing/images", {
        method: "POST",
        headers: { "X-Admin-Key": ADMIN_KEY },
        body: formData
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/marketing/images"] });
        setShowUploadImage(false);
        toast({ title: "Image uploaded", description: "Image added to library" });
      } else {
        toast({ title: "Upload failed", description: data.error, variant: "destructive" });
      }
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/marketing/images/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/images"] });
      toast({ title: "Image deleted" });
    }
  });

  const posts: MarketingPost[] = postsData?.posts || [];
  const scheduledPosts: ScheduledPost[] = scheduledData?.posts || [];
  const marketingImages: MarketingImage[] = imagesData?.images || [];
  const analytics = analyticsData?.totals || { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };

  const getWeekDays = () => {
    const days: Date[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (calendarWeekOffset * 7));
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getPostsForDay = (day: Date) => {
    return scheduledPosts.filter(p => {
      const postDate = new Date(p.scheduledFor);
      return postDate.toDateString() === day.toDateString();
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const connectMetaMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/marketing/meta/auth", {
        headers: { "X-Admin-Key": ADMIN_KEY }
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        toast({ title: "Connection failed", description: data.error, variant: "destructive" });
      }
    }
  });

  const disconnectMetaMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/marketing/meta/disconnect", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Admin-Key": ADMIN_KEY 
        },
        body: JSON.stringify({ tenantId: "darkwave" })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing/integration"] });
      toast({ title: "Disconnected", description: "Meta accounts disconnected" });
    }
  });

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    const hashtags = newHashtags.split(",").map(t => t.trim()).filter(Boolean);
    createPostMutation.mutate({ content: newContent, platform: newPlatform, hashtags });
  };

  const handleGenerateAI = () => {
    if (!aiTopic.trim()) return;
    generateAIMutation.mutate({ topic: aiTopic, tone: aiTone });
  };

  const handleAddGeneratedPost = (post: { content: string; hashtags: string[] }) => {
    createPostMutation.mutate({ content: post.content, platform: "all", hashtags: post.hashtags });
  };

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setShowSubscribe(true);
  };

  const handleCheckout = () => {
    if (!subscribeEmail.trim()) return;
    subscribeMutation.mutate({ plan: selectedPlan, email: subscribeEmail, companyName: subscribeCompany });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              <span className="font-display font-semibold">Marketing Hub</span>
            </div>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            TLId.io Powered
          </Badge>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold font-display mb-2">
            Marketing <span className="gradient-text">Automation</span>
          </h1>
          <p className="text-muted-foreground">
            Automated social media posting for the DarkWave ecosystem
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/10" data-testid="card-status-facebook">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {integration?.facebookConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
              {integration?.facebookPageName && (
                <p className="text-xs text-muted-foreground mb-2">{integration.facebookPageName}</p>
              )}
              {integration?.facebookConnected ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => disconnectMetaMutation.mutate()}
                  disabled={disconnectMetaMutation.isPending}
                  data-testid="button-disconnect-meta"
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => connectMetaMutation.mutate()}
                  disabled={connectMetaMutation.isPending}
                  data-testid="button-connect-meta"
                >
                  Connect Meta
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-testid="card-status-instagram">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {integration?.instagramConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
              {integration?.instagramUsername && (
                <p className="text-xs text-muted-foreground mb-2">@{integration.instagramUsername}</p>
              )}
              {!integration?.instagramConnected && (
                <p className="text-xs text-muted-foreground italic">Connect via Meta</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-testid="card-status-twitter">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                X (Twitter)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {integration?.twitterConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Not connected</span>
                  </>
                )}
              </div>
              {integration?.twitterUsername && (
                <p className="text-xs text-muted-foreground mt-1">@{integration.twitterUsername}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10" data-testid="card-status-schedule">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Posts per day</p>
              <p className="text-xs text-muted-foreground mt-1">8am - 8pm CST</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="glass-card border-white/10" data-testid="card-analytics-impressions">
            <CardContent className="p-4 text-center">
              <Eye className="w-6 h-6 mx-auto text-blue-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Impressions</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10" data-testid="card-analytics-reach">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto text-green-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.reach.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Reach</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10" data-testid="card-analytics-likes">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 mx-auto text-red-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.likes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Likes</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10" data-testid="card-analytics-comments">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.comments.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10" data-testid="card-analytics-shares">
            <CardContent className="p-4 text-center">
              <Share2 className="w-6 h-6 mx-auto text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.shares.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Shares</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10" data-testid="card-analytics-clicks">
            <CardContent className="p-4 text-center">
              <MousePointer className="w-6 h-6 mx-auto text-cyan-400 mb-2" />
              <p className="text-2xl font-bold">{analytics.clicks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Clicks</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <Button 
            variant={activeTab === "library" ? "default" : "ghost"}
            onClick={() => setActiveTab("library")}
            className="gap-2"
            data-testid="tab-library"
          >
            <MessageSquare className="w-4 h-4" />
            Content Library
          </Button>
          <Button 
            variant={activeTab === "calendar" ? "default" : "ghost"}
            onClick={() => setActiveTab("calendar")}
            className="gap-2"
            data-testid="tab-calendar"
          >
            <Calendar className="w-4 h-4" />
            Content Calendar
          </Button>
          <Button 
            variant={activeTab === "analytics" ? "default" : "ghost"}
            onClick={() => setActiveTab("analytics")}
            className="gap-2"
            data-testid="tab-analytics"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button 
            variant={activeTab === "images" ? "default" : "ghost"}
            onClick={() => setActiveTab("images")}
            className="gap-2"
            data-testid="tab-images"
          >
            <ImageIcon className="w-4 h-4" />
            Image Library
          </Button>
        </div>

        {activeTab === "calendar" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCalendarWeekOffset(prev => prev - 1)}
                  data-testid="button-prev-week"
                >
                  Previous Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCalendarWeekOffset(0)}
                  data-testid="button-current-week"
                >
                  This Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCalendarWeekOffset(prev => prev + 1)}
                  data-testid="button-next-week"
                >
                  Next Week
                </Button>
              </div>
              <Badge variant="outline">{scheduledPosts.length} posts scheduled</Badge>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {getWeekDays().map((day, i) => (
                <div key={i} className="min-h-[200px]">
                  <div className={`text-center py-2 mb-2 rounded-t-lg ${day.toDateString() === new Date().toDateString() ? 'bg-primary/20 border border-primary/50' : 'bg-white/5'}`}>
                    <p className="text-xs text-muted-foreground">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-lg font-bold">{day.getDate()}</p>
                  </div>
                  <div className="space-y-1">
                    {getPostsForDay(day).map((post, j) => (
                      <div 
                        key={post.id} 
                        className={`p-2 rounded text-xs ${
                          post.status === 'posted' ? 'bg-green-500/20 border-l-2 border-green-500' :
                          post.status === 'failed' ? 'bg-red-500/20 border-l-2 border-red-500' :
                          'bg-white/5 border-l-2 border-primary'
                        }`}
                        data-testid={`scheduled-post-${post.id}`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {post.platform === 'facebook' && <Facebook className="w-3 h-3" />}
                          {post.platform === 'instagram' && <Instagram className="w-3 h-3" />}
                          {post.platform === 'x' && <span className="text-xs font-bold">𝕏</span>}
                          <span className="text-muted-foreground">{formatTime(post.scheduledFor)}</span>
                        </div>
                        <p className="line-clamp-2">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "library" && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Content Library
          </h2>
          <div className="flex gap-2">
            <Button onClick={() => setShowAIGenerator(true)} variant="outline" className="gap-2" data-testid="button-ai-generate">
              <Sparkles className="w-4 h-4" />
              AI Generate
            </Button>
            <Button onClick={() => setShowNewPost(true)} className="gap-2" data-testid="button-add-content">
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div>
        </div>
        )}

        {activeTab === "library" && (
          <>
            {postsLoading ? (
              <div className="text-center py-12 text-muted-foreground" data-testid="text-loading">Loading...</div>
            ) : posts.length === 0 ? (
              <Card className="glass-card border-white/10">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-state">No content yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first marketing post to get started</p>
                  <Button onClick={() => setShowNewPost(true)} className="gap-2" data-testid="button-add-first-content">
                    <Plus className="w-4 h-4" />
                    Add Content
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <Card key={post.id} className="glass-card border-white/10" data-testid={`card-post-${post.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {post.platform === "all" ? "All Platforms" : post.platform}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => postNowMutation.mutate({ content: post.content, platform: post.platform })}
                            disabled={postNowMutation.isPending}
                            data-testid={`post-now-${post.id}`}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deletePostMutation.mutate(post.id)}
                            data-testid={`delete-post-${post.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-3 line-clamp-4" data-testid={`text-post-content-${post.id}`}>{post.content}</p>
                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.hashtags.map((tag, i) => (
                            <span key={i} className="text-xs text-primary">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Used {post.usageCount}x</span>
                        {post.lastUsedAt && (
                          <span>Last: {new Date(post.lastUsedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-impressions">
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.impressions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Impressions</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-reach">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-green-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.reach.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-likes">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 mx-auto text-red-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.likes.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-comments">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.comments.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Comments</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-shares">
                <CardContent className="p-4 text-center">
                  <Share2 className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.shares.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Shares</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-white/10" data-testid="card-analytics-full-clicks">
                <CardContent className="p-4 text-center">
                  <MousePointer className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                  <p className="text-3xl font-bold">{analytics.clicks.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Engagement Rate</span>
                    <span className="font-bold text-green-400">
                      {analytics.impressions > 0 
                        ? ((analytics.likes + analytics.comments + analytics.shares) / analytics.impressions * 100).toFixed(2)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Click-Through Rate</span>
                    <span className="font-bold text-blue-400">
                      {analytics.impressions > 0 
                        ? (analytics.clicks / analytics.impressions * 100).toFixed(2)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Content Library Size</span>
                    <span className="font-bold">{posts.length} posts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Scheduled This Week</span>
                    <span className="font-bold">{scheduledPosts.length} posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Image Library
              </h2>
              <Button onClick={() => setShowUploadImage(true)} className="gap-2" data-testid="button-upload-image">
                <Plus className="w-4 h-4" />
                Upload Image
              </Button>
            </div>
            
            {marketingImages.length === 0 ? (
              <Card className="glass-card border-white/10">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-images">No images yet</h3>
                  <p className="text-muted-foreground mb-4">Upload images to use in your social media posts</p>
                  <Button onClick={() => setShowUploadImage(true)} className="gap-2" data-testid="button-upload-first-image">
                    <Plus className="w-4 h-4" />
                    Upload Image
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {marketingImages.map((image) => (
                  <Card key={image.id} className="glass-card border-white/10 overflow-hidden" data-testid={`card-image-${image.id}`}>
                    <div className="aspect-square relative">
                      <img 
                        src={image.filePath} 
                        alt={image.filename}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                        <span className="text-white text-xs truncate flex-1">{image.filename}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 h-7 w-7 p-0"
                          onClick={() => deleteImageMutation.mutate(image.id)}
                          data-testid={`delete-image-${image.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{image.category || 'general'}</Badge>
                        <span>Used {image.usageCount}x</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 glass-card rounded-2xl p-8 border border-white/10">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display mb-2">TLId.io Marketing Suite</h3>
              <p className="text-muted-foreground mb-4">
                Automated social media posting for your business. Meta Business Suite integration,
                hourly organic posts from 6am-10pm CST, smart ad boosting, and real-time analytics.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Meta Integration</Badge>
                <Badge variant="outline">17 Posts/Day</Badge>
                <Badge variant="outline">Multi-Tenant</Badge>
                <Badge variant="outline">White-Label Ready</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold font-display mb-6 text-center">
            Get TLId.io for <span className="gradient-text">Your Business</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card border-white/10" data-testid="card-pricing-starter">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <p className="text-3xl font-bold mb-1">$99<span className="text-sm text-muted-foreground">/mo</span></p>
                <p className="text-sm text-muted-foreground mb-4">Perfect for small businesses</p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 7 posts per day</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Facebook + Instagram</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Content library</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Basic analytics</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => handleSubscribe("starter")} data-testid="button-pricing-starter">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary relative" data-testid="card-pricing-pro">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Professional</h3>
                <p className="text-3xl font-bold mb-1">$249<span className="text-sm text-muted-foreground">/mo</span></p>
                <p className="text-sm text-muted-foreground mb-4">For growing agencies</p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 17 posts per day</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> All platforms</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> AI content generation</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Smart ad boosting</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Priority support</li>
                </ul>
                <Button className="w-full" onClick={() => handleSubscribe("professional")} data-testid="button-pricing-pro">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10" data-testid="card-pricing-enterprise">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-1">$499<span className="text-sm text-muted-foreground">/mo</span></p>
                <p className="text-sm text-muted-foreground mb-4">White-label solution</p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 50 posts per day</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Your branding</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Multi-tenant for clients</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> API access</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Dedicated support</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => handleSubscribe("enterprise")} data-testid="button-pricing-enterprise">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle>Add Marketing Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger data-testid="select-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="x">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Content</label>
              <Textarea 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your marketing message..."
                rows={4}
                data-testid="input-content"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Hashtags (comma-separated)</label>
              <Input 
                value={newHashtags}
                onChange={(e) => setNewHashtags(e.target.value)}
                placeholder="web, development, tech"
                data-testid="input-hashtags"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancel</Button>
            <Button 
              onClick={handleCreatePost} 
              disabled={!newContent.trim() || createPostMutation.isPending}
              data-testid="button-create-post"
            >
              Add to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="glass-card border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Content Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Topic / Theme</label>
              <Input 
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., web development services, custom software, digital transformation"
                data-testid="input-ai-topic"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Tone</label>
              <Select value={aiTone} onValueChange={setAiTone}>
                <SelectTrigger data-testid="select-ai-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateAI} 
              disabled={!aiTopic.trim() || generateAIMutation.isPending}
              className="w-full gap-2"
              data-testid="button-generate-ai"
            >
              <Sparkles className="w-4 h-4" />
              {generateAIMutation.isPending ? "Generating..." : "Generate 3 Posts"}
            </Button>
            
            {generatedPosts.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium">Generated Posts</h4>
                {generatedPosts.map((post, i) => (
                  <Card key={i} className="glass-card border-white/10">
                    <CardContent className="p-3">
                      <p className="text-sm mb-2">{post.content}</p>
                      {post.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.hashtags.map((tag, j) => (
                            <span key={j} className="text-xs text-primary">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddGeneratedPost(post)}
                        data-testid={`button-add-generated-${i}`}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add to Library
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAIGenerator(false); setGeneratedPosts([]); }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubscribe} onOpenChange={setShowSubscribe}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle>Subscribe to TLId.io {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <Input 
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="your@email.com"
                data-testid="input-subscribe-email"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Company Name (Optional)</label>
              <Input 
                value={subscribeCompany}
                onChange={(e) => setSubscribeCompany(e.target.value)}
                placeholder="Your Company"
                data-testid="input-subscribe-company"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubscribe(false)}>Cancel</Button>
            <Button 
              onClick={handleCheckout} 
              disabled={!subscribeEmail.trim() || subscribeMutation.isPending}
              data-testid="button-checkout"
            >
              {subscribeMutation.isPending ? "Loading..." : "Continue to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadImage} onOpenChange={setShowUploadImage}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Upload Image
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append('tenantId', 'darkwave');
            formData.append('category', uploadCategory);
            uploadImageMutation.mutate(formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Image</label>
                <Input 
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  required
                  data-testid="input-upload-file"
                />
                <p className="text-xs text-muted-foreground mt-1">Max 5MB. JPEG, PNG, GIF, WebP allowed.</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger data-testid="select-upload-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowUploadImage(false)} data-testid="button-cancel-upload">Cancel</Button>
              <Button 
                type="submit"
                disabled={uploadImageMutation.isPending}
                data-testid="button-submit-upload"
              >
                {uploadImageMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

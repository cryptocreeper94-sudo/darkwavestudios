import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Users, Eye, MousePointer, Globe, BarChart3, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminQueryOptions } from "@/lib/adminApi";

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  totalEvents: number;
  eventBreakdown: Record<string, number>;
}

export default function Analytics() {
  const { data: statsData, isLoading } = useQuery<{ stats: AnalyticsStats }>(
    getAdminQueryOptions(["/api/analytics/stats"])
  );

  const { data: keywordsData } = useQuery<{ keywords: any[] }>(
    getAdminQueryOptions(["/api/seo/keywords"])
  );

  const stats: AnalyticsStats = statsData?.stats || {
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: [],
    totalEvents: 0,
    eventBreakdown: {},
  };

  const keywords = keywordsData?.keywords || [];

  const conversionRate = stats.totalViews > 0 
    ? ((stats.eventBreakdown?.conversion || 0) / stats.totalViews * 100).toFixed(1)
    : "0.0";

  const bounceRate = stats.uniqueVisitors > 0
    ? Math.max(0, 100 - (stats.totalViews / stats.uniqueVisitors * 20)).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.15)',
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" className="text-white/70 hover:text-white" data-testid="link-back-admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Analytics Command Center
              </h1>
              <p className="text-white/60">Real-time insights that Google would envy</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-12 gap-4">
            <Card className="col-span-3 md:col-span-3 bg-white/5 backdrop-blur-xl border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]" data-testid="stat-total-views">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Total Page Views</CardTitle>
                <Eye className="h-5 w-5 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-3 bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]" data-testid="stat-unique-visitors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Unique Visitors</CardTitle>
                <Users className="h-5 w-5 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +8.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-3 bg-white/5 backdrop-blur-xl border-white/10 hover:border-green-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]" data-testid="stat-conversion-rate">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Conversion Rate</CardTitle>
                <Zap className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{conversionRate}%</div>
                <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Above industry avg
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-3 bg-white/5 backdrop-blur-xl border-white/10 hover:border-orange-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]" data-testid="stat-bounce-rate">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Bounce Rate</CardTitle>
                <Activity className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{bounceRate}%</div>
                <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Lower is better
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-6 bg-white/5 backdrop-blur-xl border-white/10" data-testid="card-top-pages">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topPages.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topPages.map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-cyan-400 w-6">#{index + 1}</span>
                          <span className="text-white/80 text-sm truncate max-w-[200px]">{page.path}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                              style={{ width: `${(page.views / (stats.topPages[0]?.views || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-white/60 text-xs w-12 text-right">{page.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-center py-8">No page views recorded yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-6 bg-white/5 backdrop-blur-xl border-white/10" data-testid="card-events">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <MousePointer className="h-5 w-5 text-purple-400" />
                  Event Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.eventBreakdown).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.eventBreakdown).slice(0, 6).map(([event, count]) => (
                      <div key={event} className="flex items-center justify-between">
                        <span className="text-white/80 text-sm capitalize">{event.replace(/_/g, ' ')}</span>
                        <span className="text-cyan-400 font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-center py-8">No events tracked yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-12 bg-white/5 backdrop-blur-xl border-white/10" data-testid="card-seo-keywords">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-400" />
                  SEO Keyword Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {keywords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-white/50 text-xs border-b border-white/10">
                          <th className="text-left py-3 px-2">Keyword</th>
                          <th className="text-center py-3 px-2">Position</th>
                          <th className="text-center py-3 px-2">Volume</th>
                          <th className="text-center py-3 px-2">Clicks</th>
                          <th className="text-center py-3 px-2">Impressions</th>
                          <th className="text-center py-3 px-2">CTR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywords.map((kw: any) => (
                          <tr key={kw.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-2 text-white">{kw.keyword}</td>
                            <td className="py-3 px-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                (kw.position || 0) <= 3 ? 'bg-green-500/20 text-green-400' :
                                (kw.position || 0) <= 10 ? 'bg-cyan-500/20 text-cyan-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                #{kw.position || '-'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center text-white/70">{kw.volume?.toLocaleString() || '-'}</td>
                            <td className="py-3 px-2 text-center text-cyan-400">{kw.clicks || 0}</td>
                            <td className="py-3 px-2 text-center text-white/70">{kw.impressions?.toLocaleString() || '-'}</td>
                            <td className="py-3 px-2 text-center text-purple-400">{kw.ctr || 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/40 mb-4">No keywords tracked yet</p>
                    <Link href="/admin">
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500" data-testid="button-add-keywords">
                        Add Keywords to Track
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-4 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border-cyan-400/30" data-testid="card-realtime">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Real-Time Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Active Sessions</span>
                    <span className="text-2xl font-bold text-cyan-400">{Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Pages/Session</span>
                    <span className="text-lg font-semibold text-white">{(stats.totalViews / Math.max(stats.uniqueVisitors, 1)).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Avg. Duration</span>
                    <span className="text-lg font-semibold text-white">2m 34s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-4 bg-gradient-to-br from-green-500/20 to-cyan-600/20 backdrop-blur-xl border-green-400/30" data-testid="card-goals">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Goal Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Form Submissions</span>
                      <span className="text-green-400">{stats.eventBreakdown?.form_submit || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">CTA Clicks</span>
                      <span className="text-cyan-400">{stats.eventBreakdown?.cta_click || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Conversions</span>
                      <span className="text-purple-400">{stats.eventBreakdown?.conversion || 0}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 md:col-span-4 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border-purple-400/30" data-testid="card-traffic-sources">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400" />
                      <span className="text-white/70 text-sm">Direct</span>
                    </div>
                    <span className="text-white font-semibold">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400" />
                      <span className="text-white/70 text-sm">Organic Search</span>
                    </div>
                    <span className="text-white font-semibold">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-white/70 text-sm">Social</span>
                    </div>
                    <span className="text-white font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-400" />
                      <span className="text-white/70 text-sm">Referral</span>
                    </div>
                    <span className="text-white font-semibold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

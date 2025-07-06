# Analytics & View Tracking System

## Overview

The analytics system provides comprehensive view tracking and dashboard analytics for blog posts and services. It automatically tracks page views and provides rich analytics data for the admin dashboard.

## Features

### 📊 View Tracking

- Automatic view counting for blog posts and services
- IP-based unique visitor tracking
- Spam prevention (one view per IP per day per content)
- Visitor metadata collection (IP, User Agent, Referer)

### 📈 Analytics Dashboard

- Real-time statistics and metrics
- Interactive charts with multiple time periods
- Content popularity rankings
- Recent activity feed
- Responsive design with loading states

### 🔧 Easy Integration

- Automatic view tracking via API routes
- Optional client-side component for manual tracking
- RESTful API endpoints for custom integrations

## Database Schema

### View Tracking Table

```sql
CREATE TABLE view_tracking (
  id UUID PRIMARY KEY,
  content_type content_type_enum NOT NULL, -- 'blog_post' | 'service'
  content_id UUID NOT NULL,
  ip_address INET,
  user_agent VARCHAR(1000),
  referer VARCHAR(500),
  viewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Content Type Enum

```sql
CREATE TYPE content_type AS ENUM ('blog_post', 'service');
```

## API Endpoints

### 📊 Analytics Data

```
GET /api/admin/analytics?period={period}
```

**Parameters:**

- `period`: `today` | `week` | `month` | `quarter` | `year`

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalBlogPosts": 25,
      "totalServices": 8,
      "totalViews": 1543,
      "totalUniqueViews": 892,
      "viewsToday": 47,
      "viewsThisWeek": 312,
      "viewsThisMonth": 1203,
      "topBlogPosts": [...],
      "topServices": [...],
      "recentViews": [...]
    },
    "chartData": [...],
    "period": "month"
  }
}
```

### 📝 Record View

```
POST /api/views
```

**Body:**

```json
{
  "contentType": "blog_post", // or "service"
  "contentId": "uuid-here"
}
```

## Usage

### Automatic View Tracking

Views are automatically tracked when users access blog posts or services through the API routes:

- **Blog Posts**: `GET /api/blog/posts/[slug]`
- **Services**: `GET /api/services/[slug]`

### Manual View Tracking

For client-side tracking, use the `ViewTracker` component:

```tsx
import { ViewTracker } from "@/components/view-tracker";

export default function BlogPostPage({ post }) {
  return (
    <div>
      <ViewTracker contentType="blog_post" contentId={post.id} />
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </div>
  );
}
```

### Using the Analytics Hook

```tsx
import { useAnalytics } from "@/lib/hooks/use-analytics.hook";

function AnalyticsComponent() {
  const { data, isLoading, error } = useAnalytics("month");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Total Views: {data.stats.totalViews}</h2>
      <h3>Views This Month: {data.stats.viewsThisMonth}</h3>
    </div>
  );
}
```

### Using the Record View Hook

```tsx
import { useRecordView } from "@/lib/hooks/use-analytics.hook";

function CustomComponent() {
  const { recordView, isRecording } = useRecordView();

  const handleViewContent = async () => {
    const success = await recordView("blog_post", "content-id");
    if (success) {
      console.log("View recorded successfully");
    }
  };

  return (
    <button onClick={handleViewContent} disabled={isRecording}>
      {isRecording ? "Recording..." : "View Content"}
    </button>
  );
}
```

## Analytics Components

### 📊 AnalyticsStatsCard

Displays key metrics with icons and optional change indicators.

```tsx
<AnalyticsStatsCard
  title="Total Views"
  value={1543}
  icon={Eye}
  description="All-time page views"
  change={{
    value: 12.5,
    period: "last month",
    type: "increase",
  }}
/>
```

### 📈 AnalyticsChart

Interactive charts for visualizing view trends.

```tsx
<AnalyticsChart
  data={chartData}
  title="Views Over Time"
  type="area" // or "line"
  showUniqueViews={true}
/>
```

### 📝 ContentPopularityTable

Shows top-performing content by views.

```tsx
<ContentPopularityTable
  title="Most Popular Blog Posts"
  data={topBlogPosts}
  contentType="blog_post"
/>
```

## Admin Dashboard

Access the analytics dashboard at:

```
/admin/analytics
```

### Dashboard Features:

- **Key Metrics**: Total posts, services, views, and unique visitors
- **Time-based Metrics**: Views for today, this week, and this month
- **Interactive Charts**: Area and line charts with period selection
- **Content Rankings**: Most popular blog posts and services
- **Recent Activity**: Live feed of recent views
- **Period Filtering**: Today, week, month, quarter, year

## Performance Considerations

### View Tracking

- Views are recorded asynchronously to avoid blocking responses
- One view per IP per content per day to prevent spam
- Lightweight data collection with minimal overhead

### Analytics Queries

- Optimized database queries with proper indexing
- Efficient aggregation for statistics
- Pagination support for large datasets

### Caching

- Consider implementing Redis caching for frequently accessed analytics data
- Chart data can be cached for short periods (5-15 minutes)

## Security

### Data Privacy

- IP addresses are collected but can be hashed for privacy
- No personally identifiable information is stored
- User agent strings are truncated to reasonable lengths

### Rate Limiting

- API endpoints should implement rate limiting
- View recording has built-in spam prevention
- Analytics endpoints can be protected with authentication

## Monitoring

### Key Metrics to Monitor

- **View Tracking Rate**: Ensure views are being recorded properly
- **API Response Times**: Monitor analytics endpoint performance
- **Database Performance**: Watch for slow queries on view tracking
- **Error Rates**: Track failed view recordings and API calls

### Alerting

- Set up alerts for unusual view patterns
- Monitor for API endpoint failures
- Track database connection issues

## Troubleshooting

### Common Issues

**Views not being recorded:**

- Check database connection
- Verify API endpoints are accessible
- Check for JavaScript errors in browser console

**Analytics dashboard not loading:**

- Verify analytics API endpoint is working
- Check for proper authentication/authorization
- Look for React component errors

**Performance issues:**

- Add database indexes on frequently queried columns
- Implement caching for analytics data
- Consider data archiving for old view records

### Debug Mode

Enable debug logging by adding console logs in the view tracking functions:

```typescript
// In recordView function
console.log("Recording view:", { contentType, contentId });
```

## Future Enhancements

### Potential Features

- **Geographic Analytics**: Track views by country/region
- **Device Analytics**: Mobile vs desktop breakdown
- **Referrer Analytics**: Track traffic sources
- **Content Performance**: A/B testing support
- **Real-time Dashboard**: WebSocket-based live updates
- **Export Functionality**: CSV/PDF export of analytics data
- **Custom Events**: Track custom user interactions

### Integration Ideas

- **Google Analytics**: Sync data with GA4
- **Email Reports**: Automated analytics summaries
- **Slack/Discord**: View milestone notifications
- **API Webhooks**: Real-time data streaming

## Migration Guide

If you're adding this to an existing project:

1. **Run Database Migration:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

2. **Add View Tracking to Existing Routes:**

   - Update blog post API routes
   - Update service API routes
   - Add view tracking to detail pages

3. **Test the System:**

   - Visit some blog posts and services
   - Check the analytics dashboard
   - Verify views are being recorded

4. **Configure Monitoring:**
   - Set up error tracking
   - Monitor database performance
   - Add alerting for critical issues

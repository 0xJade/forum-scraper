# DAO Ecosystem Report Generator

A powerful, modern ecosystem report generator designed to aggregate and analyze activity across multiple data sources. Currently focused on Discourse forums, this platform provides comprehensive insights into DAO communities, tracking discussions, engagement metrics, and community health over time.

Built with Next.js 16, TypeScript, and Tailwind CSS, this application transforms raw forum data into actionable ecosystem reports that help stakeholders understand community dynamics, track governance discussions, and monitor engagement trends.

## 🎯 What Makes This Special

**Multi-Source Architecture**: Designed from the ground up to support multiple input sources. While we currently focus on Discourse forums, the architecture is built to seamlessly integrate additional data sources—from governance platforms to social media feeds, GitHub activity, and beyond.

**Intelligent Aggregation**: Not just a scraper—this is a comprehensive reporting engine that filters, analyzes, and presents data in meaningful ways. Get insights on community activity, identify trending topics, and track engagement patterns over customizable time periods.

**DAO-Focused**: Purpose-built for the decentralized autonomous organization (DAO) ecosystem, understanding the unique needs of governance communities, proposal tracking, and community health monitoring.

## ✨ Features

### Core Capabilities

- 🔍 **Multi-DAO Support**: Select from a curated list of DAOs and generate comprehensive ecosystem reports
- 📊 **Time-Based Analysis**: Filter and analyze posts from customizable time periods (default: 7 days)
- 📈 **Statistics Dashboard**: View key metrics including total posts, unique topics, and activity trends
- 🔎 **Advanced Search**: Real-time search and filtering across topics, titles, and metadata
- 📱 **Responsive Design**: Beautiful, modern interface that works flawlessly on any device
- 🌙 **Dark Mode**: Automatic dark mode support for comfortable viewing in any environment

### Data Source Integration

- **Discourse Forums** (Current): Full support for Discourse-based forums with rich metadata extraction
- **Extensible Architecture**: Ready for future integration with additional data sources
- **Unified API**: Consistent interface regardless of the underlying data source

### User Experience

- **Intuitive Landing Page**: Clean, professional interface with prominent DAO selection
- **Interactive Reports**: Click through from high-level statistics to detailed topic discussions
- **Error Handling**: Graceful error handling with clear messages and retry functionality
- **Loading States**: Smooth, informative loading indicators throughout the application
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS 4 for modern, responsive design
- **Date Handling**: date-fns for robust date manipulation
- **React**: 19.2.0 with modern hooks and patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9.0 or higher (recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd forum-scraper
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables (optional):**
```bash
cp .env.example .env.local
# Edit .env.local with your preferred DAO URLs and settings
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
forum-scraper/
├── app/
│   ├── api/                    # Server-side API routes (CORS proxy)
│   │   └── topics/            # Topic fetching and filtering endpoints
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx               # Main landing page and routing
│   └── globals.css            # Global styles
├── components/
│   ├── DAOSelector.tsx         # DAO selection dropdown
│   ├── StatisticsCard.tsx    # Ecosystem statistics display
│   ├── TopicList.tsx          # Topics list with search and filtering
│   ├── TopicDetails.tsx       # Detailed topic view
│   ├── TopicItem.tsx          # Individual topic card
│   ├── DateFormatter.tsx      # Date formatting utility
│   ├── ErrorMessage.tsx       # Error state component
│   ├── LoadingSpinner.tsx    # Loading state component
│   └── SearchBar.tsx          # Search input component
├── config/
│   └── daos.ts                # DAO configuration (extensible)
├── types/
│   └── topic.ts               # TypeScript type definitions
├── utils/
│   └── api.ts                 # Client-side API utilities
└── .env.example               # Environment variable template
```

## 🔌 Data Sources

### Current: Discourse Forums

The application currently integrates with Discourse-based forums, which power many DAO governance platforms. Support includes:

- **Topics List**: `{baseUrl}/latest.json`
- **Topic Details**: `{baseUrl}/t/{topic_id}.json`
- **Rich Metadata**: Posts, replies, views, likes, tags, and more

### Future Data Sources

The architecture is designed to support additional data sources:

- Governance platforms (Snapshot, Tally, etc.)
- Social media feeds (Twitter/X, Discord)
- GitHub repositories
- On-chain data (proposals, votes, treasury activity)
- Custom APIs and webhooks

## 📊 Usage

### Generating an Ecosystem Report

1. **Select a DAO**: Choose from the dropdown on the landing page
2. **View Statistics**: See key metrics for the selected time period
3. **Explore Topics**: Browse filtered posts and discussions
4. **Deep Dive**: Click any topic to view full details and conversation threads
5. **Navigate**: Use back buttons to return to the list or change DAOs

### Customizing Reports

- **Time Period**: Configure default days via environment variables
- **DAO Selection**: Add or modify DAOs in `config/daos.ts`
- **Forum URLs**: Override forum URLs via `.env.local` file

## 🎨 Features in Detail

### Multi-Input Architecture

The system is built with extensibility in mind. Each data source integrates through a unified interface, making it easy to add new sources without disrupting existing functionality.

### Time-Based Filtering

Intelligent date filtering ensures you see only relevant, recent activity. Topics are filtered by both creation date and last activity, capturing both new discussions and recently active threads.

### Statistics & Analytics

Get a comprehensive overview of ecosystem health:
- Total posts in the time period
- Unique topics discussed
- Date range coverage
- Activity trends

### Search & Discovery

- Real-time search filtering
- Search by title, ID, or content
- Case-insensitive matching
- Instant results as you type

### Error Handling

Robust error handling ensures a smooth experience:
- Network failure recovery
- Clear, actionable error messages
- Automatic retry functionality
- Graceful degradation

## 🔧 Development

### TypeScript

Strict TypeScript configuration ensures type safety across the entire application. All API responses are fully typed, and type guards provide runtime validation.

### Styling

Tailwind CSS provides a modern, utility-first approach to styling. The design system is responsive, accessible, and supports both light and dark modes.

### Code Organization

- **Components**: Reusable, composable UI components
- **Types**: Comprehensive TypeScript definitions
- **Utils**: Shared utilities and API helpers
- **Config**: Centralized configuration management
- **API Routes**: Server-side proxy for CORS handling

### Environment Variables

Configure the application via environment variables:

- `NEXT_PUBLIC_SSV_NETWORK_URL`: SSV Network forum URL
- `NEXT_PUBLIC_TEC_URL`: Token Engineering Commons forum URL
- `NEXT_PUBLIC_DEFAULT_DAYS`: Default days to look back (default: 7)

See `.env.example` for a complete template.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Adding New Data Sources

To add support for a new data source:

1. Create a new API route in `app/api/`
2. Define types in `types/`
3. Add client utilities in `utils/`
4. Create components for display
5. Update configuration as needed

## 📝 License

This project is open source and available under the MIT License.

## 🔮 Roadmap

### Short Term
- Additional Discourse forum integrations
- Enhanced statistics and analytics
- Export functionality (JSON/CSV)
- Custom date range selection

### Long Term
- Multi-source aggregation (governance platforms, social media)
- Advanced analytics and trend detection
- Comparative analysis across DAOs
- Real-time updates and notifications
- Custom report generation
- API for programmatic access

## 📚 Notes

- Discourse APIs return 30 topics per page by default
- Date strings use ISO 8601 format with 'Z' timezone indicator
- All API calls are proxied server-side to handle CORS
- Consider rate limiting when making frequent API requests
- The architecture supports horizontal scaling for additional data sources

## 🐛 Troubleshooting

### API Errors

If you encounter API errors:
- Verify your internet connection
- Check that the forum endpoint is accessible
- Review server logs for detailed error messages
- Some forums may have rate limiting

### Build Errors

- Ensure Node.js version is 20.9.0 or higher
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: delete `.next` directory
- Check TypeScript compilation: `npx tsc --noEmit`

### Environment Variables

- Ensure `.env.local` is in the project root
- Restart the dev server after changing environment variables
- Use `NEXT_PUBLIC_` prefix for client-accessible variables

---

**Built for the decentralized future. Designed for extensibility. Ready for tomorrow's data sources.**

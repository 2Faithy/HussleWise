import { useState, useMemo } from 'react';
import {
  Search, Star, MapPin, Store, TrendingUp, Award, Sparkles,
  X, Rocket, ArrowRight, Building2,
} from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { mockListings, type MarketplaceListing } from '../utils/marketplaceData';
import './marketplace.css';

type SortOption = 'relevance' | 'rating' | 'reviews';

export default function Marketplace() {
  const { businessProfile } = useBusinessData();
  const [isListed, setIsListed] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<MarketplaceListing | null>(null);

  const categories = useMemo(
    () => ['All Categories', ...Array.from(new Set(mockListings.map((l) => l.category)))],
    []
  );
  const locations = useMemo(
    () => ['All Locations', ...Array.from(new Set(mockListings.map((l) => l.location)))],
    []
  );

  const filtered = useMemo(() => {
    let result = [...mockListings];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.businessName.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'All Categories') {
      result = result.filter((b) => b.category === selectedCategory);
    }
    if (selectedLocation !== 'All Locations') {
      result = result.filter((b) => b.location === selectedLocation);
    }
    if (premiumOnly) {
      result = result.filter((b) => b.premium);
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => Number(b.premium) - Number(a.premium));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedLocation, premiumOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setPremiumOnly(false);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations' || premiumOnly;

  const premiumCount = mockListings.filter((l) => l.premium).length;
  const categoryCount = categories.length - 1;

  return (
    <div className="mw-page">
      {/* Hero */}
      <section className="mw-hero">
        <div className="mw-hero-pattern"></div>
        <div className="mw-hero-content">
          <div className="mw-hero-text">
            <span className="mw-hero-badge">Husslewise Marketplace</span>
            <h1 className="mw-hero-title">
              Discover & Connect with <span className="mw-highlight">Local Businesses</span>
            </h1>
            <p className="mw-hero-desc">
              Explore hustlers and small businesses across Nigeria. Find suppliers, services, and
              partners you can trust — or get discovered yourself.
            </p>

            <div className="mw-hero-search">
              <div className="mw-search-wrap">
                <Search className="mw-search-icon" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="mw-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mw-hero-stats">
              <div className="mw-hero-stat">
                <strong>{mockListings.length}+</strong>
                <span>Businesses</span>
              </div>
              <div className="mw-hero-stat-divider"></div>
              <div className="mw-hero-stat">
                <strong>{categoryCount}</strong>
                <span>Categories</span>
              </div>
              <div className="mw-hero-stat-divider"></div>
              <div className="mw-hero-stat">
                <strong>{premiumCount}</strong>
                <span>Premium</span>
              </div>
            </div>
          </div>

          <div className="mw-hero-visual">
            <div className="mw-float-card mw-float-1">
              <div className="mw-float-icon">
                <Award />
              </div>
              <span>Premium Listing</span>
            </div>
            <div className="mw-float-card mw-float-2">
              <div className="mw-float-icon success">
                <TrendingUp />
              </div>
              <span>Get Discovered</span>
            </div>
            <div className="mw-float-card mw-float-3">
              <div className="mw-float-icon">
                <Store />
              </div>
              <span>List For Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Your listing status — real, tied to app state */}
      <section className="mw-stats-bar" style={{ paddingBottom: 0, gridTemplateColumns: '1fr' }}>
        <div
          className="mw-stat-card"
          style={{ background: 'var(--primary)', border: 'none', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="mw-stat-icon-wrap" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Building2 className="mw-stat-icon" style={{ color: 'white' }} />
            </div>
            <div className="mw-stat-content">
              <span className="mw-stat-value" style={{ color: 'white' }}>
                {isListed ? `${businessProfile.businessName} is live` : "You're not listed yet"}
              </span>
              <span className="mw-stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {isListed ? 'Customers can find you here' : 'Get discovered — free to list'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsListed(!isListed)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'white',
              color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
              fontSize: 13, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}
          >
            <Rocket size={15} />
            {isListed ? 'Manage Listing' : 'List My Business'}
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mw-stats-bar">
        <div className="mw-stat-card">
          <div className="mw-stat-icon-wrap"><Store className="mw-stat-icon" /></div>
          <div className="mw-stat-content">
            <span className="mw-stat-value">{mockListings.length}</span>
            <span className="mw-stat-label">Businesses</span>
          </div>
        </div>
        <div className="mw-stat-card">
          <div className="mw-stat-icon-wrap"><MapPin className="mw-stat-icon" /></div>
          <div className="mw-stat-content">
            <span className="mw-stat-value">{locations.length - 1}</span>
            <span className="mw-stat-label">Locations</span>
          </div>
        </div>
        <div className="mw-stat-card">
          <div className="mw-stat-icon-wrap"><Award className="mw-stat-icon" /></div>
          <div className="mw-stat-content">
            <span className="mw-stat-value">{premiumCount}</span>
            <span className="mw-stat-label">Premium Listings</span>
          </div>
        </div>
        <div className="mw-stat-card">
          <div className="mw-stat-icon-wrap"><Sparkles className="mw-stat-icon" /></div>
          <div className="mw-stat-content">
            <span className="mw-stat-value">{categoryCount}</span>
            <span className="mw-stat-label">Categories</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mw-filters-section">
        <div className="mw-filters-bar">
          <div className="mw-filters-left">
            <div className="mw-filter-group">
              <label>Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="mw-filter-group">
              <label>Location</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="mw-filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>

          <div className="mw-filters-right">
            <label className="mw-toggle">
              <input type="checkbox" checked={premiumOnly} onChange={(e) => setPremiumOnly(e.target.checked)} />
              <span className="mw-toggle-track"></span>
              <span>Premium Only</span>
            </label>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mw-results-section">
        <div className="mw-results-header">
          <h2>
            Showing <span>{filtered.length}</span> businesses
            {hasActiveFilters && (
              <button className="mw-clear-btn" onClick={clearAllFilters}>Clear Filters</button>
            )}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="mw-no-results">
            <Search />
            <h3>No businesses found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="mw-reset-btn" onClick={clearAllFilters}>Reset All Filters</button>
          </div>
        ) : (
          <div className="mw-businesses-grid">
            {filtered.map((biz) => (
              <div key={biz.id} className={`mw-business-card ${biz.premium ? 'mw-featured' : ''}`}>
                {biz.premium && (
                  <div className="mw-featured-badge">
                    <Award />
                    Premium
                  </div>
                )}

                <div className="mw-card-header">
                  <div className="mw-business-avatar">{biz.businessName.charAt(0)}</div>
                  <div className="mw-business-meta">
                    <h3 className="mw-business-name">{biz.businessName}</h3>
                    <div className="mw-business-rating">
                      <Star fill="currentColor" />
                      <span>{biz.rating}</span>
                      <span className="mw-review-count">({biz.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <p className="mw-business-desc">{biz.tagline}</p>

                <div className="mw-details-grid">
                  <div className="mw-detail-item">
                    <MapPin />
                    <span>{biz.location}</span>
                  </div>
                  <div className="mw-detail-item">
                    <Store />
                    <span>{biz.category}</span>
                  </div>
                </div>

                <div className="mw-card-footer">
                  <button className="mw-btn-view" onClick={() => setSelectedBusiness(biz)}>
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mw-cta">
        <div className="mw-cta-card">
          <div className="mw-cta-content">
            <h2>List Your Business on Husslewise</h2>
            <p>Join hustlers growing their visibility and reaching new customers through our marketplace.</p>
            <ul>
              <li><TrendingUp /> Get discovered by customers searching your category</li>
              <li><Award /> Stand out with a Premium listing</li>
              <li><Store /> Free to list — upgrade only if you want more visibility</li>
            </ul>
          </div>
          <div className="mw-cta-action">
            <button className="mw-cta-btn" onClick={() => setIsListed(true)}>
              List Your Business Free
              <ArrowRight />
            </button>
            <span>Free forever tier available</span>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedBusiness && (
        <div className="mw-modal-overlay" onClick={() => setSelectedBusiness(null)}>
          <div className="mw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="mw-modal-close" onClick={() => setSelectedBusiness(null)}>
              <X />
            </button>

            <div className="mw-modal-header">
              <div className="mw-modal-avatar">{selectedBusiness.businessName.charAt(0)}</div>
              <div className="mw-modal-info">
                <h2 className="mw-modal-name">{selectedBusiness.businessName}</h2>
                <div className="mw-modal-meta">
                  <span>{selectedBusiness.category}</span>
                  <span className="mw-meta-sep">|</span>
                  <span>{selectedBusiness.location}</span>
                </div>
                <div className="mw-modal-rating">
                  <div className="mw-stars">
                    <Star fill="currentColor" />
                    <strong>{selectedBusiness.rating}</strong>
                    <span>out of 5</span>
                  </div>
                  <span className="mw-total-reviews">{selectedBusiness.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            <div className="mw-modal-body">
              <section className="mw-modal-section">
                <h3>About</h3>
                <p>{selectedBusiness.tagline}</p>
              </section>

              {selectedBusiness.premium && (
                <div className="mw-premium-note">
                  <Award size={16} color="var(--warning)" />
                  This is a Premium listing — appears at the top of search results.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
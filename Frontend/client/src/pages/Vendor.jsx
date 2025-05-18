
import { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #e6f7ec, #fcf0f7, #f3e8fa)',
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  header: {
    padding: '20px 15px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 auto',
    maxWidth: '1200px'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0 40px 0',
    color: '#333',
    position: 'relative',
    paddingBottom: '12px'
  },
  titleDecoration: {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: '#ffb6c1',
    borderRadius: '2px'
  },
  locationSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
  },
  locationTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333'
  },
  locationOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  locationButton: (active) => ({
    padding: '12px 15px',
    borderRadius: '6px',
    border: 'none',
    background: active ? '#ffb6c1' : '#f0f0f0',
    color: active ? '#333' : '#555',
    fontWeight: active ? '600' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: active ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
  }),
  locationIcon: {
    width: '20px',
    height: '20px',
    color: '#555'
  },
  locationInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '15px'
  },
  inputRow: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: '1',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px'
  },
  applyButton: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    background: '#ffb6c1',
    color: '#333',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  featuredSection: {
    marginBottom: '50px'
  },
  featuredContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '25px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    width: '340px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  featuredImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  },
  featuredContent: {
    padding: '25px',
    background: 'linear-gradient(to right, #ffecd2, #ffcfd9)'
  },
  featuredBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: 'rgba(255, 182, 193, 0.2)',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#d81b60',
    marginBottom: '10px'
  },
  vendorName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
  },
  vendorCategory: {
    color: '#666',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  categoryIcon: {
    width: '16px',
    height: '16px',
    color: '#888'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  ratingReviews: {
    display: 'flex',
    flexDirection: 'column'
  },
  rating: {
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  starIcon: {
    color: '#ffc107',
    width: '18px',
    height: '18px'
  },
  reviews: {
    fontSize: '14px',
    color: '#666'
  },
  location: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  locationText: {
    maxWidth: '100px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  viewButton: {
    width: '100%',
    marginTop: '12px',
    padding: '12px 15px',
    backgroundColor: '#ffb6c1',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    color: '#333'
  },
  contentLayout: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px'
  },
  sidebar: {
    width: '280px'
  },
  categoriesBox: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  categoriesTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px'
  },
  categoryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  categoryItem: {
    marginBottom: '8px'
  },
  categoryButton: (active) => ({
    width: '100%',
    textAlign: 'left',
    padding: '12px 15px',
    margin: '5px 0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? '#f8b195' : '#f5f5f5',
    color: active ? '#333' : '#555',
    transition: 'all 0.3s ease',
    fontWeight: active ? '600' : 'normal',
    boxShadow: active ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
  }),
  categoryCount: (active) => ({
    backgroundColor: active ? '#fff' : '#eee',
    padding: '3px 10px',
    borderRadius: '30px',
    fontSize: '13px',
    color: '#555',
    fontWeight: '500'
  }),
  vendorsSection: {
    flex: 1
  },
  vendorsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  vendorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
  },
  vendorCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  vendorImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  vendorContent: {
    padding: '20px'
  },
  vendorInfo: {
    marginBottom: '12px'
  },
  vendorRatingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '12px',
    alignItems: 'center'
  },
  ratingStars: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    color: '#ffc107'
  },
  vendorBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px'
  },
  price: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#333'
  },
  detailsButton: {
    backgroundColor: '#ffb6c1',
    padding: '8px 15px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#333',
    transition: 'background-color 0.3s'
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    marginTop: '70px'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '15px'
  },
  footerLink: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '14px'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #ffb6c1',
    animation: 'spin 1s linear infinite'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  loadingText: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#666',
    marginLeft: '15px'
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    color: '#666'
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '25px',
    color: '#c62828',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};

// Define the API base URL - change this to match your backend server address
const API_BASE_URL = 'http://localhost:5000';

// Mock images for categories based on placeholder API
const categoryIcons = {
  'Photography': '📷',
  'Catering': '🍽️',
  'Decorations': '🎉',
  'Entertainment': '🎭',
  'Venues': '🏛️',
  'Flowers': '💐'
};

export default function EventEaseMarketplace() {
  const [vendors, setVendors] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState({
    city: '',
    state: ''
  });
  const [locationType, setLocationType] = useState('auto');
  const [manualCoordinates, setManualCoordinates] = useState({ lat: '', lng: '' });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Fetch user's location
  const fetchUserLocation = () => {
    setIsGettingLocation(true);
    setLocationType('auto');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLocation);
          setIsGettingLocation(false);
          
          // Try to get the city name from coordinates using reverse geocoding
          reverseGeocode(userLocation.lat, userLocation.lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a location if geolocation fails
          setLocation({ lat: 40.7128, lng: -74.0060 }); // New York City
          setManualLocation({ city: 'New York', state: 'NY' });
          setIsGettingLocation(false);
        }
      );
    } else {
      // Default location if geolocation not supported
      setLocation({ lat: 40.7128, lng: -74.0060 });
      setManualLocation({ city: 'New York', state: 'NY' });
      setIsGettingLocation(false);
    }
  };

  // Function to get city name from coordinates (mock for simplicity)
  const reverseGeocode = async (lat, lng) => {
    try {
      // In a real app, you would call a geocoding API here
      // For now, we'll just set a placeholder value
      setManualLocation({
        city: 'Current Location',
        state: ''
      });
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  // Function to get coordinates from city name (mock for simplicity)
  const geocodeCity = async () => {
    // In a real app, you would call a geocoding API here
    // For this demo, we'll just set some default coordinates based on major cities
    const cityLower = manualLocation.city.toLowerCase();
    
    // Simple mapping of cities to coordinates
    const cityCoordinates = {
      'new york': { lat: 40.7128, lng: -74.0060 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'houston': { lat: 29.7604, lng: -95.3698 },
      'phoenix': { lat: 33.4484, lng: -112.0740 },
      'philadelphia': { lat: 39.9526, lng: -75.1652 },
      'san antonio': { lat: 29.4241, lng: -98.4936 },
      'san diego': { lat: 32.7157, lng: -117.1611 },
      'dallas': { lat: 32.7767, lng: -96.7970 },
      'san francisco': { lat: 37.7749, lng: -122.4194 }
    };
    
    // Try to find the city in our mapping
    if (cityCoordinates[cityLower]) {
      return cityCoordinates[cityLower];
    }
    
    // If city not found, use manual coordinates if provided
    if (manualCoordinates.lat && manualCoordinates.lng) {
      return {
        lat: parseFloat(manualCoordinates.lat),
        lng: parseFloat(manualCoordinates.lng)
      };
    }
    
    // Default to New York if no match
    return { lat: 40.7128, lng: -74.0060 };
  };

  // Handle manual location submission
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLocationType('manual');
    setLoading(true);
    
    const coordinates = await geocodeCity();
    setLocation(coordinates);
  };

  // Initialize with auto location on first load
  useEffect(() => {
    fetchUserLocation();
  }, []);

  // Fetch data from backend API when location or category changes
  useEffect(() => {
    if (!location) return;

    const fetchVendors = async () => {
      try {
        setLoading(true);
        
        // Build API URL with query parameters
        const queryParams = new URLSearchParams({
          lat: location.lat,
          lng: location.lng,
          category: selectedCategory !== 'All' ? selectedCategory : ''
        });
        
        const response = await fetch(`${API_BASE_URL}/api/vendors?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`Server returned error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format price to display as currency
        const formattedVendors = data.vendors.map(vendor => ({
          ...vendor,
          price: `$${vendor.price}`
        }));
        
        const formattedFeatured = data.featuredVendors.map(vendor => ({
          ...vendor,
          price: `$${vendor.price}`
        }));
        
        setVendors(formattedVendors);
        setFeaturedVendors(formattedFeatured);
        setCategories(data.categories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
        
        // Use mock data as fallback if API fails
        useMockData();
      }
    };
    
    fetchVendors();
  }, [location, selectedCategory]);

  // Fallback mock data function
  const useMockData = () => {
    const mockCategories = [
      { name: 'All', count: 478 },
      { name: 'Photography', count: 142 },
      { name: 'Catering', count: 98 },
      { name: 'Decorations', count: 76 },
      { name: 'Entertainment', count: 63 },
      { name: 'Venues', count: 51 },
      { name: 'Flowers', count: 37 }
    ];
    
    // Featured vendors
    const mockFeatured = [
      {
        id: 100,
        name: 'EventPro Photography',
        category: 'Photography',
        rating: '4.8',
        reviews: 188,
        location: manualLocation.city || 'Local Area',
        price: '$150',
        imageUrl: '/api/placeholder/400/200'
      },
      {
        id: 101,
        name: 'Gourmet Event Catering',
        category: 'Catering',
        rating: '4.9',
        reviews: 166,
        location: manualLocation.city || 'Local Area',
        price: '$200',
        imageUrl: '/api/placeholder/400/200'
      }
    ];
    
    // Regular vendors
    const mockVendors = [];
    const categoriesList = ['Photography', 'Catering', 'Decorations', 'Entertainment', 'Venues', 'Flowers'];
    
    categoriesList.forEach(cat => {
      for (let i = 0; i < 3; i++) {
        mockVendors.push({
          id: mockVendors.length + 1,
          name: `${cat} Vendor ${mockVendors.length + 1}`,
          category: cat,
          rating: (Math.random() * 1 + 4).toFixed(1),
          reviews: Math.floor(Math.random() * 100) + 5,
          location: manualLocation.city || 'Local Area',
          price: `$${(Math.random() * 200 + 50).toFixed(0)}`,
          imageUrl: '/api/placeholder/300/150'
        });
      }
    });
    
    setCategories(mockCategories);
    setVendors(mockVendors.filter(v => selectedCategory === 'All' || v.category === selectedCategory));
    setFeaturedVendors(mockFeatured);
  };

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  // Get filtered vendors
  const filteredVendors = vendors.filter(vendor => 
    selectedCategory === 'All' || vendor.category === selectedCategory
  );

  // Render loading state
  if (loading && !isGettingLocation) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <span style={styles.loadingText}>Loading vendors...</span>
      </div>
    );
  }

  // Main render
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>EventEase Marketplace</h1>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <span>⚠️</span>
            <div>
              <p><strong>Error:</strong> {error}</p>
              <p>Using fallback data instead.</p>
            </div>
          </div>
        )}

        {/* Location Section */}
        <section style={styles.locationSection}>
          <h2 style={styles.locationTitle}>Select Location</h2>
          <div style={styles.locationOptions}>
            <button 
              style={styles.locationButton(locationType === 'auto')}
              onClick={fetchUserLocation}
              disabled={isGettingLocation}
            >
              <span>📍</span>
              {isGettingLocation ? 'Getting your location...' : 'Use current location'}
            </button>

            <button 
              style={styles.locationButton(locationType === 'manual')}
              onClick={() => setLocationType('manual')}
            >
              <span>🔍</span>
              Enter city manually
            </button>

            {locationType === 'manual' && (
              <form onSubmit={handleLocationSubmit} style={styles.locationInputGroup}>
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="City"
                    value={manualLocation.city}
                    onChange={(e) => setManualLocation({...manualLocation, city: e.target.value})}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State/Province"
                    value={manualLocation.state}
                    onChange={(e) => setManualLocation({...manualLocation, state: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Latitude (optional)"
                    value={manualCoordinates.lat}
                    onChange={(e) => setManualCoordinates({...manualCoordinates, lat: e.target.value})}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Longitude (optional)"
                    value={manualCoordinates.lng}
                    onChange={(e) => setManualCoordinates({...manualCoordinates, lng: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <button type="submit" style={styles.applyButton}>Apply Location</button>
              </form>
            )}
          </div>
        </section>

        {/* Featured Vendors Section */}
        {featuredVendors.length > 0 && (
          <section style={styles.featuredSection}>
            <h2 style={styles.sectionTitle}>
              Featured Vendors
              <div style={styles.titleDecoration}></div>
            </h2>
            <div style={styles.featuredContainer}>
              {featuredVendors.map(vendor => (
                <div key={vendor.id} style={styles.featuredCard}>
                  <img
                    src={vendor.imageUrl || '/api/placeholder/400/200'}
                    alt={vendor.name}
                    style={styles.featuredImage}
                  />
                  <div style={styles.featuredContent}>
                    <span style={styles.featuredBadge}>Featured</span>
                    <h3 style={styles.vendorName}>{vendor.name}</h3>
                    <div style={styles.vendorCategory}>
                      <span>{categoryIcons[vendor.category] || '🏢'}</span>
                      <span>{vendor.category}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <div style={styles.ratingReviews}>
                        <div style={styles.rating}>
                          <span>⭐</span>
                          <span>{vendor.rating}</span>
                        </div>
                        <span style={styles.reviews}>({vendor.reviews} reviews)</span>
                      </div>
                      <div style={styles.location}>
                        <span>📍</span>
                        <span style={styles.locationText}>{vendor.location}</span>
                      </div>
                    </div>
                    <button style={styles.viewButton}>View Details ({vendor.price})</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main content with sidebar and vendors grid */}
        <div style={styles.contentLayout}>
          {/* Sidebar with categories */}
          <aside style={styles.sidebar}>
            <div style={styles.categoriesBox}>
              <h3 style={styles.categoriesTitle}>Categories</h3>
              <ul style={styles.categoryList}>
                {categories.map(category => (
                  <li key={category.name} style={styles.categoryItem}>
                    <button
                      style={styles.categoryButton(selectedCategory === category.name)}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      <span>
                        {categoryIcons[category.name] || '🏢'} {category.name}
                      </span>
                      <span style={styles.categoryCount(selectedCategory === category.name)}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Vendors grid section */}
          {/* Vendors grid section */}
<section style={styles.vendorsSection}>
  <h2 style={styles.vendorsTitle}>
    {selectedCategory === 'All' ? 'All Vendors' : selectedCategory}
    {selectedCategory !== 'All' && ` (${filteredVendors.length})`}
  </h2>

  {filteredVendors.length === 0 ? (
    <div style={styles.noResults}>
      <h3>No vendors found in this category</h3>
      <p>Try selecting a different category or changing your location.</p>
    </div>
  ) : (
    <div style={styles.vendorsGrid}>
      {filteredVendors.map(vendor => (
        <div key={vendor.id} style={styles.vendorCard}>
          <img
            src={vendor.imageUrl || '/api/placeholder/300/150'}
            alt={vendor.name}
            style={styles.vendorImage}
          />
          <div style={styles.vendorContent}>
            <div style={styles.vendorInfo}>
              <h3 style={styles.vendorName}>{vendor.name}</h3>
              <div style={styles.vendorCategory}>
                <span>{categoryIcons[vendor.category] || '🏢'}</span>
                <span>{vendor.category}</span>
              </div>
            </div>

            <div style={styles.vendorRatingRow}>
              <div style={styles.ratingStars}>
                <span>⭐</span>
                <span>{vendor.rating}</span>
                <span style={styles.reviews}>({vendor.reviews})</span>
              </div>
              <div style={styles.location}>
                <span>📍</span>
                <span style={styles.locationText}>{vendor.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
</div>
</main>
</div>
  );
}
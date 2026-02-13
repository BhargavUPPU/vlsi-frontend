// Usage examples for ContentLoading component

import ContentLoading from './content-loading';

// Example 1: Basic content loading
export function BasicExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Basic Content Loading</h2>
      <ContentLoading />
    </div>
  );
}

// Example 2: Inline content loading (for cards/sections)
export function InlineExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Dashboard</h2>
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '0', 
        margin: '20px 0'
      }}>
        <ContentLoading 
          inline={true}
          size="small"
          message="Loading dashboard data..."
          showText={true}
        />
      </div>
    </div>
  );
}

// Example 3: Large content area loading
export function LargeContentExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>VLSI Project Dashboard</h1>
      <ContentLoading 
        size="large"
        message="Loading VLSI project data..."
        showText={true}
      />
    </div>
  );
}

// Example 4: Conditional content loading
export function ConditionalExample({ isLoading, data }) {
  if (isLoading) {
    return (
      <ContentLoading 
        size="medium"
        message="Fetching latest updates..."
        showText={true}
      />
    );
  }

  return (
    <div>
      {/* Your actual content here */}
      <h3>Content loaded!</h3>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

// Example 5: Within a card component
export function CardWithLoading({ loading = true }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minHeight: '300px'
    }}>
      {loading ? (
        <ContentLoading 
          inline={true}
          size="medium"
          message="Loading card content..."
          showText={false}  // Hide text for cleaner card look
        />
      ) : (
        <div style={{ padding: '20px' }}>
          <h3>Card Content</h3>
          <p>Your actual card content goes here</p>
        </div>
      )}
    </div>
  );
}
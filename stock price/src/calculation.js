export const calculateCorrelationMatrix = (allStockData, stockTickers) => {
  
  const alignedData = alignStockData(allStockData, stockTickers);
  
  
  const n = stockTickers.length;
  const matrix = Array(n).fill().map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1; 
      } else if (j > i) {
        const correlation = calculatePearsonCorrelation(
          alignedData.map(item => item[i].price),
          alignedData.map(item => item[j].price)
        );
        matrix[i][j] = correlation;
        matrix[j][i] = correlation; 
      }
    }
  }
  
  return matrix;
};

const alignStockData = (allStockData, stockTickers) => {
  
  const allTimestamps = new Set();
  allStockData.forEach(stockData => {
    stockData.forEach(item => {
      allTimestamps.add(item.lastUpdatedAt);
    });
  });
  
  const sortedTimestamps = Array.from(allTimestamps).sort();
  
  
  return sortedTimestamps.map(timestamp => {
    return stockTickers.map((ticker, index) => {
      const stockData = allStockData[index];
      const dataPoint = stockData.find(item => item.lastUpdatedAt === timestamp);
      
     
      if (!dataPoint) {
        const prevData = stockData
          .filter(item => item.lastUpdatedAt < timestamp)
          .sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))[0];
        return prevData || { price: 0, lastUpdatedAt: timestamp };
      }
      
      return dataPoint;
    });
  });
};

const calculatePearsonCorrelation = (x, y) => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  

  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
 
  let covariance = 0;
  let stdDevX = 0;
  let stdDevY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    
    covariance += diffX * diffY;
    stdDevX += diffX * diffX;
    stdDevY += diffY * diffY;
  }
  
  covariance /= (n - 1);
  stdDevX = Math.sqrt(stdDevX / (n - 1));
  stdDevY = Math.sqrt(stdDevY / (n - 1));
  
  
  return covariance / (stdDevX * stdDevY);
};
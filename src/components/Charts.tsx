import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  height?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, height = "h-48" }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className={`${height} flex items-end justify-between space-x-2`}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full rounded-t-md ${item.color} transition-all duration-300 hover:opacity-80`}
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? '4px' : '0'
              }}
            />
            <div className="mt-2 text-center">
              <div className="text-white font-semibold text-sm">{item.value}</div>
              <div className="text-dark-400 text-xs">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DonutChartProps {
  data: ChartData[];
  title: string;
  centerText?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, centerText }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createArcPath = (percentage: number, startPercentage: number) => {
    const start = startPercentage * 2 * Math.PI;
    const end = (startPercentage + percentage) * 2 * Math.PI;
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    const radius = 45;
    const innerRadius = 25;
    
    const x1 = 50 + radius * Math.cos(start);
    const y1 = 50 + radius * Math.sin(start);
    const x2 = 50 + radius * Math.cos(end);
    const y2 = 50 + radius * Math.sin(end);
    
    const x3 = 50 + innerRadius * Math.cos(end);
    const y3 = 50 + innerRadius * Math.sin(end);
    const x4 = 50 + innerRadius * Math.cos(start);
    const y4 = 50 + innerRadius * Math.sin(start);
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const path = createArcPath(percentage, cumulativePercentage);
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  className={item.color}
                  stroke="currentColor"
                  strokeWidth="0"
                  fill="currentColor"
                />
              );
            })}
          </svg>
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{total}</div>
                <div className="text-xs text-dark-400">{centerText}</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-dark-300">{item.label}</span>
              </div>
              <div className="text-sm text-white font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

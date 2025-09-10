import React from 'react';

export const SimpleBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.atual || 0, d.meta || 0)));
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-orange-600 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">
                {typeof item.atual === 'number' && item.atual > 1000 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.atual)
                  : item.atual
                } / {typeof item.meta === 'number' && item.meta > 1000 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.meta)
                  : item.meta
                }
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-orange-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((item.atual / item.meta) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {Math.round((item.atual / item.meta) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimplePieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-orange-600 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{item.value}</div>
              <div className="text-xs text-gray-500">
                {Math.round((item.value / total) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual representation */}
      <div className="mt-4 flex rounded-lg overflow-hidden h-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center text-white text-xs font-medium"
            style={{ 
              backgroundColor: item.color,
              width: `${(item.value / total) * 100}%`
            }}
          >
            {item.value > total * 0.1 ? item.value : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleLineChart = ({ data, title }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-orange-600 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{item.name}</span>
            <span className="text-orange-600 font-semibold">
              {typeof item.vgv === 'number' 
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.vgv)
                : item.vgv
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


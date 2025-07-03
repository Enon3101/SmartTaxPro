import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import { Briefcase, PiggyBank, TrendingUp, DollarSign, Landmark } from 'lucide-react';

interface IncomeSourceStepProps {
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
  showSalaryOption: boolean;
  filerType: string | null;
}

const IncomeSourceStep: React.FC<IncomeSourceStepProps> = ({
  selectedSources,
  onSourceChange,
  showSalaryOption,
  filerType
}) => {
  const handleSourceToggle = (source: string) => {
    if (selectedSources.includes(source)) {
      onSourceChange(selectedSources.filter(s => s !== source));
    } else {
      onSourceChange([...selectedSources, source]);
    }
  };

  const incomeOptions = [
    {
      id: 'salary',
      label: 'Salary Income',
      description: 'Income from employment',
      icon: Briefcase,
      available: showSalaryOption,
    },
    {
      id: 'house-property',
      label: 'House Property',
      description: 'Rental income from property',
      icon: Landmark,
      available: true,
    },
    {
      id: 'capital-gains',
      label: 'Capital Gains',
      description: 'Profit from sale of assets',
      icon: TrendingUp,
      available: true,
    },
    {
      id: 'business',
      label: 'Business & Profession',
      description: 'Income from business activities',
      icon: PiggyBank,
      available: true,
    },
    {
      id: 'other-sources',
      label: 'Other Sources',
      description: 'Interest, dividends, etc.',
      icon: DollarSign,
      available: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Sources</CardTitle>
        {filerType && (
          <p className="text-sm text-muted-foreground">
            Entity Type: {filerType}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select all applicable income sources for the assessment year:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomeOptions.map((option) => {
              const IconComponent = option.icon;
              
              return (
                <div
                  key={option.id}
                  className={`
                    flex items-start space-x-3 p-4 border rounded-lg cursor-pointer
                    ${option.available ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'}
                    ${selectedSources.includes(option.id) ? 'border-blue-500 bg-blue-50' : ''}
                  `}
                  onClick={() => option.available && handleSourceToggle(option.id)}
                >
                  <Checkbox
                    checked={selectedSources.includes(option.id)}
                    disabled={!option.available}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <Label className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                    {!option.available && (
                      <p className="text-sm text-red-500 mt-1">
                        Not available for {filerType} entity type
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedSources.length === 0 && (
            <p className="text-sm text-amber-600 p-3 bg-amber-50 rounded-lg">
              Please select at least one income source to proceed
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSourceStep;
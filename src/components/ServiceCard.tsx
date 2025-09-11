import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  onLearnMore: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  icon,
  onLearnMore
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          {icon}
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        <Button variant="outline" className="w-full" onClick={onLearnMore}>
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
import React from 'react';

export interface ProductFeature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface NutritionalInfo {
  label: string;
  value: string;
}

export interface NavItem {
  label: string;
  href: string;
}
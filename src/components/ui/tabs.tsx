import React from 'react';
import { Tabs as MuiTabs, Tab } from '@mui/material';

export function Tabs({ children, ...props }: any) {
  return <MuiTabs {...props}>{children}</MuiTabs>;
}

export function TabsList({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function TabsTrigger(props: any) {
  return <Tab {...props} />;
}

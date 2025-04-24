
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EnquiryList from '../pages/EnquiryList';

const EnquiryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnquiryList />} />
    </Routes>
  );
};

export default EnquiryRoutes;

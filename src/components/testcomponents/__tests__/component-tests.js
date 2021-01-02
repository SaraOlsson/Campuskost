import React from 'react';
import { render, screen } from '@testing-library/react';
import MyTestComponent from '../MyTestComponent'

it ('component test', () => {

    render(<MyTestComponent />)
    expect(screen.getByText('Hi my test component')).toBeInTheDocument();

});
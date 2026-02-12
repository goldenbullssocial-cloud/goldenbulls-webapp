import CalculatorDetails from '@/modulers/calculatorDetails'
import React from 'react'

export default async function page({ params }) {
    const { id } = await params
    
    return (
        <div>
            <CalculatorDetails calculatorId={id} />
        </div>
    )
}

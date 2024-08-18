import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useTotalCostStore } from '@/store/totalCost'
import { DollarSignIcon } from 'lucide-react'

const CostCard = ({serviceCosts}) => {

  console.log(serviceCosts)
  const sortedServiceCosts = serviceCosts?.sort((a, b) => b.cost - a.cost);
  console.log(sortedServiceCosts)

  return (
    <>
      {serviceCosts && (
        sortedServiceCosts.map((svc) => (
          <Card key={svc.service}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{svc.service}</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {svc.cost.toFixed(5)}</div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  )
}

export default CostCard

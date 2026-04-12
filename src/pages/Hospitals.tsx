import React from 'react';
import { useHospitals } from '@/hooks/useHospitals';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Phone, MapPin, Mail, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Hospitals: React.FC = () => {
  const { hospitals, isLoading } = useHospitals();
  const { orders } = useOrders();

  const getOrderCount = (hospitalId: string) => {
    return orders.filter((o) => o.hospital_id === hospitalId).length;
  };

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Hospitals</h1>
          <p className="text-muted-foreground mt-1">
            Manage all registered hospitals
          </p>
        </div>

        {/* Hospitals Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hospitals.length > 0 ? (
                hospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{hospital.name}</p>
                          <p className="text-sm text-muted-foreground">{hospital.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {hospital.city}{hospital.state ? `, ${hospital.state}` : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {hospital.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {hospital.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getOrderCount(hospital.id)} orders
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {hospital.is_active ? (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(hospital.created_at), 'PP')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hospitals registered yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
  );
};

export default Hospitals;

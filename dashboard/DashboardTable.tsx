import React, { useState } from "react";

export type SurveyResponse = {
  _id?: { $oid: string };
  doctorName?: string;
  hospitalName?: string;
  specialty?: string;
  specialtyOther?: string;
  yearsOfPractice?: string;
  practiceSetting?: string;
  managedThyroidPatients?: string;
  familiarWithMWA?: string;
  learnedAboutMWA?: string;
  learnedAboutMWAOther?: string;
  mwaIndications?: string[];
  mwaComparison?: string;
  contraindications?: string;
  mwaExperience?: string;
  procedureCount?: string;
  observedOutcomes?: string[];
  complications?: string[];
  complicationsOther?: string;
  mwaViableAlternative?: string;
  adoptionFactors?: string[];
  attendWorkshop?: string;
  additionalComments?: string;
  receiveUpdates?: string;
  contactEmail?: string;
  mwaInterest?: string;
  mwaLearnMethod?: string[];
  mwaLearnOther?: string;
  mwaAttendCME?: string;
  mwaConcerns?: string[];
  mwaConcernOther?: string;
  mwaReceiveResources?: string;
  mwaResourceEmail?: string;
  __v?: number;
  [key: string]: any;
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Filter, Download } from "lucide-react";

export interface DashboardTableProps {
  responses: SurveyResponse[];
}

export const DashboardTable: React.FC<DashboardTableProps> = ({ responses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterMWAExperience, setFilterMWAExperience] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [selectedDoctors, setSelectedDoctors] = useState<Set<string>>(new Set());

  // Get unique specialties for filter
  const specialties = [...new Set(responses.map(r => r.specialty).filter(Boolean))];

  // Filter responses based on search and filters
  const filteredResponses = responses.filter(response => {
    const matchesSearch = !searchTerm || 
      response.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = filterSpecialty === "all" || response.specialty === filterSpecialty;
    const matchesMWAExperience = filterMWAExperience === "all" || response.mwaExperience === filterMWAExperience;

    return matchesSearch && matchesSpecialty && matchesMWAExperience;
  });

  // Handle individual doctor selection
  const handleDoctorSelect = (doctorId: string, isChecked: boolean) => {
    const newSelected = new Set(selectedDoctors);
    if (isChecked) {
      newSelected.add(doctorId);
    } else {
      newSelected.delete(doctorId);
    }
    setSelectedDoctors(newSelected);
  };

  // Handle select all/none
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = filteredResponses.map((r, index) => r._id?.$oid || `${r.doctorName}-${index}`);
      setSelectedDoctors(new Set(allIds));
    } else {
      setSelectedDoctors(new Set());
    }
  };

  // Export selected doctors to CSV
  const exportSelectedToCSV = () => {
    const selectedResponses = filteredResponses.filter((response, index) => {
      const doctorId = response._id?.$oid || `${response.doctorName}-${index}`;
      return selectedDoctors.has(doctorId);
    });
    
    if (selectedResponses.length === 0) {
      alert("Please select at least one doctor to export.");
      return;
    }

    const headers = [
      "Doctor Name", "Hospital", "Specialty", "Years of Practice", "Practice Setting",
      "Managed Thyroid Patients", "Familiar with MWA", "MWA Experience", "Procedure Count",
      "MWA Indications", "Complications", "Additional Comments"
    ];
    
    const csvContent = [
      headers.join(","),
      ...selectedResponses.map(response => [
        response.doctorName || "",
        response.hospitalName || "",
        response.specialty || "",
        response.yearsOfPractice || "",
        response.practiceSetting || "",
        response.managedThyroidPatients || "",
        response.familiarWithMWA || "",
        response.mwaExperience || "",
        response.procedureCount || "",
        (response.mwaIndications || []).join("; "),
        (response.complications || []).join("; "),
        response.additionalComments || ""
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected-doctors-survey-${selectedResponses.length}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = [
      "Doctor Name", "Hospital", "Specialty", "Years of Practice", "Practice Setting",
      "Managed Thyroid Patients", "Familiar with MWA", "MWA Experience", "Procedure Count",
      "MWA Indications", "Complications", "Additional Comments"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredResponses.map(response => [
        response.doctorName || "",
        response.hospitalName || "",
        response.specialty || "",
        response.yearsOfPractice || "",
        response.practiceSetting || "",
        response.managedThyroidPatients || "",
        response.familiarWithMWA || "",
        response.mwaExperience || "",
        response.procedureCount || "",
        (response.mwaIndications || []).join("; "),
        (response.complications || []).join("; "),
        response.additionalComments || ""
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thyroid-survey-responses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (selectedResponse) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Response Details</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setSelectedResponse(null)}
            >
              Back to Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm text-gray-600">Doctor Name</label>
                  <p className="text-sm">{selectedResponse.doctorName || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Hospital</label>
                  <p className="text-sm">{selectedResponse.hospitalName || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Specialty</label>
                  <p className="text-sm">{selectedResponse.specialty || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Years of Practice</label>
                  <p className="text-sm">{selectedResponse.yearsOfPractice || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Practice Setting</label>
                  <p className="text-sm">{selectedResponse.practiceSetting || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Manages Thyroid Patients</label>
                  <Badge variant={selectedResponse.managedThyroidPatients === "yes" ? "default" : "secondary"}>
                    {selectedResponse.managedThyroidPatients || "Not provided"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* MWA Experience */}
            <div>
              <h3 className="text-lg font-semibold mb-3">MWA Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm text-gray-600">Familiar with MWA</label>
                  <Badge variant={selectedResponse.familiarWithMWA === "yes" ? "default" : "secondary"}>
                    {selectedResponse.familiarWithMWA || "Not provided"}
                  </Badge>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Has MWA Experience</label>
                  <Badge variant={selectedResponse.mwaExperience === "yes" ? "default" : "secondary"}>
                    {selectedResponse.mwaExperience || "Not provided"}
                  </Badge>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Procedure Count</label>
                  <p className="text-sm">{selectedResponse.procedureCount || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Learned About MWA</label>
                  <p className="text-sm">{selectedResponse.learnedAboutMWA || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* MWA Clinical Data */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Clinical Data</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm text-gray-600">MWA Indications</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedResponse.mwaIndications?.length ? 
                      selectedResponse.mwaIndications.map((indication, idx) => (
                        <Badge key={idx} variant="outline">{indication}</Badge>
                      )) : 
                      <span className="text-sm text-gray-500">Not provided</span>
                    }
                  </div>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Observed Complications</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedResponse.complications?.length ? 
                      selectedResponse.complications.map((complication, idx) => (
                        <Badge key={idx} variant="outline">{complication}</Badge>
                      )) : 
                      <span className="text-sm text-gray-500">Not provided</span>
                    }
                  </div>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">MWA vs Traditional Methods</label>
                  <p className="text-sm">{selectedResponse.mwaComparison || "Not provided"}</p>
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-600">Contraindications</label>
                  <p className="text-sm">{selectedResponse.contraindications || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            {selectedResponse.additionalComments && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Comments</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedResponse.additionalComments}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>Survey Responses ({filteredResponses.length})</CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Button 
              variant="outline" 
              onClick={exportSelectedToCSV} 
              className="flex items-center space-x-2"
              disabled={selectedDoctors.size === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export Selected ({selectedDoctors.size})</span>
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export All CSV</span>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by doctor name, hospital, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty} value={specialty || ""}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterMWAExperience} onValueChange={setFilterMWAExperience}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by MWA experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience Levels</SelectItem>
              <SelectItem value="yes">Has MWA Experience</SelectItem>
              <SelectItem value="no">No MWA Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedDoctors.size === filteredResponses.length && filteredResponses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>MWA Familiar</TableHead>
                <TableHead>MWA Experience</TableHead>
                <TableHead>Procedures</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.map((response, index) => {
                const doctorId = response._id?.$oid || `${response.doctorName}-${index}`;
                return (
                  <TableRow key={doctorId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDoctors.has(doctorId)}
                        onCheckedChange={(checked) => handleDoctorSelect(doctorId, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {response.doctorName || "Not provided"}
                    </TableCell>
                    <TableCell>{response.hospitalName || "Not provided"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {response.specialty || "Not specified"}
                      </Badge>
                    </TableCell>
                    <TableCell>{response.yearsOfPractice || "Not provided"}</TableCell>
                    <TableCell>
                      <Badge variant={response.familiarWithMWA === "yes" ? "default" : "secondary"}>
                        {response.familiarWithMWA || "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={response.mwaExperience === "yes" ? "default" : "secondary"}>
                        {response.mwaExperience || "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {response.procedureCount || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResponse(response)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredResponses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No responses found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

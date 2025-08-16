
import { VisitItem } from '../types/VisitItem';

interface PaginatedResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  first: boolean;
  last: boolean;
}

class VisitService {
  private baseUrl = '/api/v1/visits'; // Adjust this to match your API endpoint

  async getAllVisits(
    page: number = 0, 
    size: number = 10, 
    search: string = ''
  ): Promise<PaginatedResponse<VisitItem>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search && { search })
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response to match our expected format
      return {
        content: data.content || [],
        number: data.number || page,
        size: data.size || size,
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        hasNext: !data.last && data.number < data.totalPages - 1,
        first: data.first || page === 0,
        last: data.last || false
      };
    } catch (error) {
      console.error('Error fetching visits:', error);
      // Return mock data for development/testing
      return this.getMockVisits(page, size, search);
    }
  }

  private getMockVisits(page: number, size: number, search: string): PaginatedResponse<VisitItem> {
    // Generate mock data for testing
    const allMockVisits: VisitItem[] = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      uid: `VIS-${String(index + 1).padStart(6, '0')}`,
      patientName: `Patient ${index + 1}`,
      patientId: `PAT-${String(index + 1).padStart(6, '0')}`,
      doctorName: `Dr. Smith ${index % 5 + 1}`,
      visitDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      visitType: index % 3 === 0 ? 'Follow-up' : index % 3 === 1 ? 'New Patient' : 'Emergency',
      status: index % 4 === 0 ? 'Completed' : index % 4 === 1 ? 'In Progress' : index % 4 === 2 ? 'Scheduled' : 'Cancelled',
      complaints: `Complaint ${index + 1}`,
      diagnosis: index % 2 === 0 ? `Diagnosis ${index + 1}` : undefined,
      treatment: index % 3 === 0 ? `Treatment ${index + 1}` : undefined,
      notes: `Visit notes for patient ${index + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Filter by search if provided
    const filteredVisits = search 
      ? allMockVisits.filter(visit => 
          visit.patientName.toLowerCase().includes(search.toLowerCase()) ||
          visit.doctorName.toLowerCase().includes(search.toLowerCase()) ||
          visit.uid.toLowerCase().includes(search.toLowerCase())
        )
      : allMockVisits;

    // Paginate
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const pageData = filteredVisits.slice(startIndex, endIndex);

    return {
      content: pageData,
      number: page,
      size: size,
      totalElements: filteredVisits.length,
      totalPages: Math.ceil(filteredVisits.length / size),
      hasNext: endIndex < filteredVisits.length,
      first: page === 0,
      last: endIndex >= filteredVisits.length
    };
  }
}

export default new VisitService();

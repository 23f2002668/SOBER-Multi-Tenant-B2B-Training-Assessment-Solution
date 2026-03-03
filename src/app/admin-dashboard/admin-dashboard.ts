import { Component, signal, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LogoComponent } from '../logo/logo';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

interface DashboardData {
    name: string,
    admin_id: string,
    company_name: string,
    company_logo: string,
    current_dept_quota: number,
    current_emp_quota: number,
    current_trn_quota: number,
    current_asses_quota: number,
    subscription: string,
    total_dept_quota: number,
    total_emp_quota: number,
    total_trn_quota: number,
    total_asses_quota: number,
    price: number,
}

interface DataResponse {
    message: string
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LogoComponent, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('engagementChart') engagementChartRef!: ElementRef;
    @ViewChild('completionChart') completionChartRef!: ElementRef;
    @ViewChild('trendChart') trendChartRef!: ElementRef;

    private engagementChart: any;
    private completionChart: any;
    private trendChart: any;

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {};

    loading = signal(true);
    dashboardData = signal<any>(null);

    name = signal<string>('');
    id = signal<string>("");
    usertype_: string = "";
    usertoken_: string = "";
    usertype = signal<string>(this.usertype_ ||'');
    company_name = signal<string>('');
    company_logo = signal<string>('');
    current_dept_quota = signal<number>(0);
    current_emp_quota = signal<number>(0);
    current_trn_quota = signal<number>(0);
    current_asses_quota = signal<number>(0);
    subscription = signal<string>('');
    price = signal<number>(0);
    total_dept_quota = signal<number>(0);
    total_emp_quota = signal<number>(0);
    total_trn_quota = signal<number>(0);
    total_asses_quota = signal<number>(0);

    ngOnInit(): void {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.usertype_ = localStorage.getItem('usertype') || "";
      this.usertoken_ = localStorage.getItem('token') || "";
      this.updateDashboardData();
    }

    // Form visibility flags
    showAddProgramForm = false;
    showAddEmployeeForm = false;
    showAddDepartmentForm = false;
    showAddAssessmentForm = false;

    // Form methods
    showAssessmentForm(): void {
      this.showAddAssessmentForm = true;
      this.showAddProgramForm = false;
      this.showAddDepartmentForm = false;
      this.showAddEmployeeForm = false;
    }

    showProgramForm(): void {
      this.showAddProgramForm = true;
      this.showAddAssessmentForm = false;
      this.showAddDepartmentForm = false;
      this.showAddEmployeeForm = false;
    }

    showEmployeeForm(): void {
      this.showAddEmployeeForm = true;
      this.showAddAssessmentForm = false;
      this.showAddProgramForm = false;
      this.showAddDepartmentForm = false;
    }

    showDepartmentForm(): void {
      this.showAddDepartmentForm = true;
      this.showAddProgramForm = false;
      this.showAddAssessmentForm = false;
      this.showAddEmployeeForm = false;
    }

    hideAssessmentForm(): void {
      this.showAddAssessmentForm = false;
    }

    hideProgramForm(): void {
      this.showAddProgramForm = false;
    }

    hideEmployeeForm(): void {
      this.showAddEmployeeForm = false;
    }

    hideDepartmentForm(): void {
      this.showAddDepartmentForm = false;
    }

    resetProgramForm(): void {
      // Reset Program form fields
      console.log('Resetting Program form');
    }

    resetAssessmentForm(): void {
      // Reset Assessment form fields
      console.log('Resetting Assessment form');
    }

    resetDepartmentForm(): void {
      // Reset department form fields
      console.log('Resetting department form');
    }

    resetEmployeeForm(): void {
      // Reset employee form fields
      console.log('Resetting employee form');
    }

    newPgmName: string = "";
    newPgmId: string = "";
    newPgmDept: string = "";

    createTrainingProgram(): void {
      // Handle Program creation
      console.log('Creating Training Program');
      this.hideProgramForm();

      const adminId: string = this.id();
      this.sendData("Training", "ADD", adminId);
    }

    newAssName: string = "";
    newAssId: string = "";
    newAssDept: string = "";
    createAssessment(): void {
      // Handle Assessment creation
      console.log('Creating Assessment');
      this.hideEmployeeForm();

      const adminId: string = this.id();
      this.sendData("Assessment", "ADD", adminId);
    }

    newDeptName: string = "";
    newDeptCode: string = "";

    createDepartment(): void {
      alert('Creating Department : ' + this.newDeptName);
      this.hideDepartmentForm();
      const adminId: string = this.id();
      this.sendData("Department", "ADD", adminId);
    }

    newEmpName: string = "";
    newEmpId: string = "";
    newEmpMob: string = "";
    newEmpEmail: string = "";
    newEmpDeptId: string = "";
    newEmpPgmId: string = "";
    newEmpAssId: string = "";

    createEmployee(): void {
      alert('Creating Employee : ' + this.newEmpName);
      console.log('Creating employee');
      this.hideEmployeeForm();
      const adminId: string = this.id();
      this.sendData("Employee", "ADD", adminId);
    }

  /**
   * Sends data to the server and ensures dashboard is refreshed with latest data
   * The async/await pattern prevents race conditions by ensuring each operation
   * completes before the next one starts
   */

    async sendData(title: string, operation: string, adminId: string): Promise<void> {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      let Data: any = {};

      const DeptData = {
        title: title,
        name: this.newDeptName,
        id: this.newDeptCode,
        operation: operation,
        adminId: adminId
      }

      const EmpData = {
        title: title,
        name: this.newEmpName,
        id: this.newEmpId,
        mobile: this.newEmpMob,
        email: this.newEmpEmail,
        deptId: this.newEmpDeptId,
        pgmId: this.newEmpPgmId,
        assId: this.newEmpAssId,
        operation: operation,
        adminId: adminId
      }

      const TrnData = {
        title: title,
        name: this.newPgmName,
        id: this.newPgmId,
        deptId: this.newPgmDept,
        operation: operation,
        adminId: adminId
      }

      const AssData = {
        title: title,
        name: this.newAssName,
        id: this.newAssId,
        deptId: this.newAssDept,
        operation: operation,
        adminId: adminId
      }

      if (title==="Department") {
          Data = DeptData;
      }else if (title==="Employee") {
          Data = EmpData;
      }else if (title==="Training") {
          Data = TrnData;
      }else if (title==="Assessment") {
        Data = AssData;
      }else {
          alert("Error in creating new " + title)
          return;
      }

      const token = this.usertoken_;

      if (!token) {
        console.log('No token found');
        this.router.navigate(['/login']);
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      console.log("Data :", Data);

      try {
          // Step 1: Post the data and wait for response
          // This completes before moving to next step - prevents race condition #1
          const response = await this.http.post<DataResponse>(
          "http://localhost:8000/feature-operations", Data, { headers }
          ).toPromise();

          // Refresh dashboard data and wait for it to complete
          // This prevents race condition #3 (refresh starting before post completes)
          await this.updateDashboardData();

          // Step 4: Reset form fields after everything is done
          //this.resetFormFields(title);

          console.log('✅ All operations completed successfully in sequence');
      }catch (error) {
          console.error('❌ Error in sendData:', error);
          alert("Operation failed! Please try again some time.");
      }
    }

    /**
    * Helper method to create a delay
    * Essential for ensuring backend has processed the data
    */
    private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Async version of refresh that returns a Promise
     * This ensures we can await its completion
    */
    async updateDashboardData(): Promise<void> {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      const token = this.usertoken_;

      if (!token) {
        console.log('No token found');
        this.router.navigate(['/login']);
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const apiUrl = 'http://localhost:8000/admin-dashboard';
      console.log('🔍 Calling URL:', apiUrl);
      console.log('🔍 With headers:', headers);

      try {
        const response = await this.http.get<DashboardData>(apiUrl, { headers }).toPromise();

        if (!response) {
          console.error('No data received');
          this.loading.set(false);
          return;
        }

        console.log('Dashboard data:', response);
        this.name.set(response.name || '');
        this.id.set(response.admin_id || '');
        this.company_name.set(response.company_name || '');
        this.company_logo.set(response.company_logo || '');
        this.current_dept_quota.set(response.current_dept_quota || 0);
        this.current_emp_quota.set(response.current_emp_quota || 0);
        this.current_trn_quota.set(response.current_trn_quota || 0);
        this.current_asses_quota.set(response.current_asses_quota || 0);
        this.subscription.set(response.subscription || '');
        this.total_dept_quota.set(response.total_dept_quota || 0);
        this.total_emp_quota.set(response.total_emp_quota || 0);
        this.total_trn_quota.set(response.total_trn_quota || 0);
        this.total_asses_quota.set(response.total_asses_quota || 0);
        this.price.set(response.price || 0);
        this.dashboardData.set(response);
        this.loading.set(false);

        // Update charts with new data
        this.updateCharts();

      }catch (error) {
        console.error('Error fetching dashboard:', error);
        // Type guard to check if error is an HTTP error response
        if (this.isHttpError(error)) {
          if (error.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.clear();
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            alert('You do not have permission to access this page');
            this.router.navigate(['/login']);
          } else {
            alert('Error loading dashboard');
          }
        } else {
          // Handle non-HTTP errors
          alert('An unexpected error occurred');
        }

        this.loading.set(false);
        throw error;
      }
    }

    private isHttpError(error: any): error is { status: number; message: string } {
      return error && typeof error === 'object' && 'status' in error;
    }

    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        // Wait a bit for the DOM to be fully ready
        setTimeout(() => {
          this.initializeCharts();
        }, 100);
      }
    }

    // New method to initialize charts with error handling
    initializeCharts(): void {
      try {
        this.createEngagementChart();
        this.createCompletionChart();
        this.createTrendChart();
      } catch (error) {
        console.error('Error creating charts:', error);
      }
    }

    // Engagement Chart (Doughnut)
    createEngagementChart(): void {
      if (!this.engagementChartRef) return;

      const ctx = this.engagementChartRef.nativeElement.getContext('2d');

      this.engagementChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not Started'],
          datasets: [{
            data: [this.current_trn_quota(), 45, 23], // Use your actual data
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',  // Green
              'rgba(59, 130, 246, 0.8)',  // Blue
              'rgba(239, 68, 68, 0.8)'    // Red
            ],
            borderColor: 'white',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: false }
          },
          cutout: '70%'
        }
      });
    }

    // Completion Chart (Bar)
    createCompletionChart(): void {
      if (!this.completionChartRef) return;

      const ctx = this.completionChartRef.nativeElement.getContext('2d');

      this.completionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Completions',
            data: [85, 92, 68, 96, 82, 58, 52],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(99, 102, 241, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'white' }
            },
            x: {
              grid: { display: false },
              ticks: { color: 'white' }
            }
          }
        }
      });
    }

    // Trend Chart (Line)
    createTrendChart(): void {
      if (!this.trendChartRef) return;

      const ctx = this.trendChartRef.nativeElement.getContext('2d');

      this.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Enrollment Trend',
            data: [65, 78, 92, 88, 105],
            borderColor: 'rgba(139, 92, 246, 1)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgba(139, 92, 246, 1)',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'white' }
            },
            x: {
              grid: { display: false },
              ticks: { color: 'white' }
            }
          }
        }
      });
    }

    // Update charts when data changes
    updateCharts(): void {
      if (!isPlatformBrowser(this.platformId)) return;

      // Update engagement chart data
      if (this.engagementChart) {
        this.engagementChart.data.datasets[0].data = [
          this.current_trn_quota(),
          this.current_emp_quota(),
          this.total_dept_quota() - this.current_dept_quota()
        ];
        this.engagementChart.update();
      }

      // Update completion chart with dynamic data
      if (this.completionChart) {
        // Update with actual weekly data from your backend
        this.completionChart.update();
      }
    }

    logout() {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }
        localStorage.clear();
        this.router.navigate(["/login"]);
    }
}

import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Cluster {
  code?: number;
  companyCode?: number;
  clusterBranchCode?: number;
  clusterShortDesc?: string;
  clusterName: string;
  clusterDescription?: string;
  clusterStatus: string;
  clusterCountryCode?: number;
  clusterRegionCode?: number;
}

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss'],
})
export class ClustersComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  statuses: string[] = ['ACTIVE', 'INACTIVE'];
  user: any;
  clusters: Cluster[] = [];
  cluster: Cluster = { clusterName: '', clusterStatus: '' };
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<ClustersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getClusters();
  }

  onClose() {
    this.dialogRef.close();
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getClusters() {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.clusters.getAll}?clusterBranchCode=${this.data.branch.code}`;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = this.errorMessage = '';
          this.dataSource.data = res.data.filter((cluster: Cluster) => cluster.clusterStatus.toUpperCase() != 'DELETED');
          this.dataSource.paginator = this.paginator;
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  save() {
    this.cluster.clusterDescription = this.cluster.clusterShortDesc = this.cluster.clusterName;
    this.cluster.companyCode = this.data.branch.companyCode;
    this.cluster.clusterCountryCode = this.data.branch.countryCode;
    this.cluster.clusterRegionCode = this.data.branch.regionCode;
    this.cluster.clusterBranchCode = this.data.branch.code;

    if (this.cluster.code === undefined) {
      this.createCluster(this.cluster);
    } else {
      this.updateCluster(this.cluster);
    }
  }

  createCluster(cluster: Cluster) {
    this.loading = true;
    this.successMessage = this.errorMessage = '';
    const endpoint: string = ENVIRONMENT.endpoints.clusters.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, cluster).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Cluster added successfully';
          this.cluster = { clusterName: '', clusterStatus: '' };
          this.getClusters();
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  updateCluster(cluster: Cluster) {
    this.loading = true;
    this.successMessage = this.errorMessage = '';
    const endpoint: string = ENVIRONMENT.endpoints.clusters.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, cluster).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Cluster updated successfully';
          this.cluster = { clusterName: '', clusterStatus: '' };
          this.getClusters();
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  editCluster(cluster: Cluster) {
    this.cluster.code = cluster.code;
    this.cluster.clusterName = cluster.clusterName;
    this.cluster.clusterStatus = cluster.clusterStatus;
  }

  deleteCluster(cluster: Cluster) {
    this.loading = true;
    cluster.clusterStatus = 'DELETED';
    this.successMessage = this.errorMessage = '';
    const endpoint: string = ENVIRONMENT.endpoints.clusters.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, cluster).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Cluster deleted successfully';
          this.getClusters();
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }
}

import request from '@/utils/request';

export async function getDashboardInfo(): Promise<any> {
  return request.get('/rest/dashboardInfo');
}

export async function getChartInfo(startDate: string, endDate: string): Promise<any> {
  return request.get('/rest/chartInfo?startDate=' + startDate + '&endDate=' + endDate);
}

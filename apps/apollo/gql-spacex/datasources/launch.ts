import { RESTDataSource } from '@apollo/datasource-rest';


export type Rocket={
  id: string;
  name: string;
  type: string;
}

export type Mission ={
  name: string;
  missionPatchSmall: string;
  missionPatchLarge: string;
}
export type LaunchSite={
  site_name: string;

}
export type Launch={
  id: number;
  cursor: string;
  launch_date_unix?: number;
  site: LaunchSite;
  mission: Mission;
  rocket: Rocket;


}
export class LaunchAPI extends RESTDataSource {

    override baseURL = 'https://api.spacexdata.com/v2/';

  // leaving this inside the class to make the class easier to test
  launchReducer(launch): Launch {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getAllLaunches():Promise<Launch[]> {
    const response = await this.get('launches');

    // transform the raw launches to a more friendly
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch)) : [];
  }

  async getLaunchById({ launchId }) :Promise<Launch>  {
    const res = await this.get('launches', {params :{ flight_number: launchId }}); //wrap param in {params:{}}
    return this.launchReducer(res[0]);
  }

  async getLaunchesByIds({ launchIds }):Promise<Launch[]> {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId })),
    );
  }
}


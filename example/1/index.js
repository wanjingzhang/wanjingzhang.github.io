
import { reactive, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccountInfo } from '@azure/msal-browser';
import { useMsal } from '@/composition-api/useMsal';
import { useIsAuthenticated } from '@/composition-api/useIsAuthenticated';
import { loginRequest } from '@/authConfig';
import { UserInfo, ImageInfo, UserList } from '@/utils/UserInfo';
import { useUserStore } from '@/stores/user';
import { displayStore } from '@/stores/menu';
import {
  indexData,
  imgCDN,
  ld,
  BuTeamInfoAdmin,
  OfficeData,
  indImgList,
} from '@/data/data';
import { ElMessage } from 'element-plus';
import API from '@/api/api';
import { teamAdmin } from '@/api/apiAll';
import {
  gaEvent,
  getToday,
  getFrontName,
  calculateScreenSize,
} from '@/utils/tools';

const isAuthenticated = useIsAuthenticated();
const { instance, accounts } = useMsal();
const user = useUserStore();
const displayd = displayStore();
const routerNav = useRouter();
const isAuthen = ref(0);
let loaded = false;

const state = reactive({
  load: true,
  data: {} as UserInfo,
  dictionary: {},
  cities: indexData.cities,
  cities2: indImgList,
  cur: {
    city: 'Shanghai', // 当前城市id
    year: '2022',
  },
  urls: new Array<string>(indexData.cities.length),
  ldimg: imgCDN + ld,
  isSmall: false,
  loadedImg: {},
  ismob: false,
  projectData: [],
});

const multiple = 30;

function transformElement(x, y, element) {
  const box = element.getBoundingClientRect();
  const calcX = -(y - box.y - box.height / 2) / multiple;
  const calcY = (x - box.x - box.width / 2) / multiple;

  element.style.transform = `rotateX(${calcX}deg) rotateY(${calcY}deg)  `;
}

function handleMouseMove(e) {
  const element = e.currentTarget;
  window.requestAnimationFrame(() => {
    transformElement(e.clientX, e.clientY, element);
  });
}

function handleMouseLeave(e) {
  const element = e.currentTarget;
  window.requestAnimationFrame(() => {
    element.style.transform = 'rotateX(0) rotateY(0)  ';
  });
}

const resizeHandler = async () => {
  let { mobile } = await calculateScreenSize();
  state.ismob = mobile;
};

// login
watchEffect(() => {
  if (!loaded) {
    loaded = true;

    setTimeout(async () => {
      if (isAuthenticated.value == true) {
        let { name, username }: AccountInfo = accounts.value[0];
        gaEvent('page_view', {
          event_category: 'general',
          event_label: 'authenticated',
          value: getFrontName(name) + '-Index-' + getToday(),
        });
        // username = 'JoanneChow@mmoser.com';
        // state.username = accounts.value[0];
        // 获取 rowguid
        await API.Login(username, (res) => {
          if (res.code == 200) {
            user.data = Object.assign(
              {
                userename: name,
                mail: username,
                staff_arrival: false,
              },
              res.userout[0]
            );

            if (res.userout.length == 0) {
              isAuthen.value = 6;
            } else {
              // 判断kc权限
              API.KCAccessUser(res.userout[0].rowguid, async (res1) => {
                if (res1.code == 200) {
                  // if (mobile) {
                  // 加入判断如果他当前有这些列表，那么就获取，如果当前不在列表中，默认显示上海
                  if (state.cities.indexOf(user.data?.officeid) != -1) {
                    state.cur.city = user.data?.officeid;
                  }

                  console.log('city===', state.cur.city);
                  await getImage(
                    state.cur.city,
                    state.cities.indexOf(state.cur.city)
                  );
                  // } else {
                  for (let area in indImgList) {
                    const cities = indImgList[area];
                    cities.forEach((city, index) => {
                      if (
                        (index == 0 && area != 'EMEA') ||
                        (index == 2 && area == 'EMEA')
                      ) {
                        loadImg(city, area);
                      }
                    });
                  }

                  await resizeHandler();
                  window.addEventListener('resize', resizeHandler);

                  // 获取用户其他权限
                  await getPermission(res.userout[0].rowguid);
                } else if (res1.code == 401) {
                  // hasn't promission for kc
                  isAuthen.value = 6;
                }
              });
            }
          } else {
            // hasn't promission for kc
            isAuthen.value = 6;
          }
        });
      } else {
        isAuthen.value = 5;
      }
    }, 2000);
  } else {
    return;
  }
});

// 获取用户其他权限
const getPermission = async (uid: string): Promise<void> => {
  if (window.innerHeight < 600) {
    state.isSmall = true;
  }
  // 是否用户是大陆人 isMainlandChina
  let isMainlandChina = false;
  for (let office in OfficeData['Mainland China']['child']) {
    if (
      OfficeData['Mainland China']['child'][office]['key'] == user.data.officeid
    ) {
      isMainlandChina = true;
    }
  }
  user.data.isMainlandChina = isMainlandChina;

  // 读取用户是否有Arrival和Departure的权限
  const resStaffLA = await API.KCStaffADUser(uid);
  if (resStaffLA.code == 200) {
    user.data.staff_arrival = true;
  }

  // 获取TAS permission
  let res = await API['TASPermissionList']();
  if (res.code == 200) {
    if (res.userlist.length > 0) {
      console.log('TAS permission');
      let ary = res.userlist.filter((obj: UserList) => obj.userid == uid);
      if (ary.length > 0) {
        user.data.tas_arrival = true;
      }
    }
  }

  // 判断 Bu Team Info admin 权限
  let teaminfoAdminAry = BuTeamInfoAdmin.filter(
    (item) => item.toLowerCase() == uid.toLowerCase()
  );
  if (teaminfoAdminAry.length > 0) {
    user.data.teaminfo_admin = true;
  } else {
    user.data.teaminfo_admin = false;
  }

  // 判断 Bu Team Info income 权限
  let resteamInfo = await API['KCContractSecretryList']();
  if (resteamInfo.code == 200) {
    if (resteamInfo.userlist.length > 0) {
      console.log('Bu TeamInfo Income');
      let ary = resteamInfo.userlist.filter(
        (obj: UserList) => obj.userid == uid
      );
      if (ary.length > 0) {
        user.data.teaminfo_income = true;
      }
    }
  }

  // 判断CA访问权限
  if (user.data.ca_superadmin == 'Y' || user.data.ca_adminright == 'Y') {
    user.data.ca_right = 'Y';
  } else {
    user.data.ca_right = 'Y';
    // let res2 = await API.caCAPermision(uid);
    // if (res2.code == 200) {
    //   user.data.ca_right = 'Y';
    // } else {
    //   user.data.ca_right = 'N';
    // }
  }

  // 0. 判断用户是否是 Team 管理员
  user.data.teamAdmin = await teamAdmin(user.data.rowguid);
  console.log('====', user.data.teamAdmin);

  let page = routerNav.currentRoute.value.query?.page;
  let city = routerNav.currentRoute.value.query?.city;
  let tasuid = routerNav.currentRoute.value.query?.uid;
  let tid = routerNav.currentRoute.value.query?.tid;
  console.log(page);
  if (page === 'arrival') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/arrival/`,
    });
  } else if (page === 'teaminfo') {
    // 获取路由，判断是否可以转过去
    if (user.data.teaminfo_admin && tid != undefined) {
      routerNav.push({
        path: `/teaminfo/${tid}`,
      });
    } else {
      routerNav.push({
        path: `/teaminfo/`,
      });
    }
  } else if (page === 'teaminfolist') {
    routerNav.push({
      path: `/teaminfolist/`,
    });
  } else if (page === 'tas') {
    // 获取路由，判断是否可以转过去
    if (user.data.tas_arrival) {
      if (tasuid != undefined) {
        routerNav.push({
          path: `/tas/${tasuid}`,
        });
      } else {
        routerNav.push({
          path: `/tas/`,
        });
      }
    }
  } else if (page === 'taslist') {
    // 获取路由，判断是否可以转过去
    if (user.data.tas_arrival) {
      routerNav.push({
        path: `/taslist/`,
      });
    }
  } else if (page === 'teaminfoincome') {
    // 获取路由，判断是否可以转过去
    if (user.data.teaminfo_income && tid != undefined) {
      routerNav.push({
        path: `/teaminfoincome/${tid}`,
      });
    } else {
      routerNav.push({
        path: `/teaminfoincome/`,
      });
    }
  } else if (page === 'teaminfoincomeonelist') {
    // 获取路由，判断是否可以转过去
    if (user.data.teaminfo_income && tid != undefined) {
      routerNav.push({
        path: `/teaminfoincomeonelist/${tid}`,
      });
    }
  } else if (page === 'incomebuforone') {
    // 获取路由，判断是否可以转过去
    if (user.data.teaminfo_income && tid != undefined) {
      routerNav.push({
        path: `/incomebuforone/${tid}`,
      });
    }
  } else if (page === 'callin') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/callin`,
    });
  } else if (page === 'applyleave') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/applyleave`,
    });
  } else if (page === 'staffleave') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/staffleave`,
    });
  } else if (page === 'staffdeparture') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/staffdeparture`,
    });
  } else if (page === 'staffdepartue') {
    // 获取路由，判断是否可以转过去
    console.log('staffdepartue/all');
    if (city != undefined) {
      routerNav.push({
        path: `/staffdepartue/${city}`,
      });
    } else {
      routerNav.push({
        path: `/staffdepartue/`,
      });
    }
  } else if (page === 'officelist') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/officelist`,
    });
  } else if (page === 'contractaccounting') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/contractaccounting/`,
    });
  } else if (page === 'caadmin') {
    routerNav.push({
      path: `/contractaccounting/manager/admin`,
    });
  } else if (page === 'forecastbu') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/forecastbu/${String(city).toLowerCase()}/`,
    });
  } else if (page === 'forecastbu2') {
    // 获取路由，判断是否可以转过去
    routerNav.push({
      path: `/forecastbu2/${String(city).toLowerCase()}/`,
    });
  } else if (page === 'webquote') {
    routerNav.push({
      path: `/webquote`,
    });
  } else if (page === 'admin') {
    if (user.data.kc_adminright == 'Y') {
      routerNav.push({
        path: `/admin/admin`,
      });
    } else {
      isAuthen.value = 7;
    }
  } else if (page === 'staffdtypecount') {
    routerNav.push({
      path: `/staffdtypecount/`,
    });
  } else if (page === 'stafftable') {
    routerNav.push({
      path: `/stafftable/`,
    });
  } else if (page === 'officeadmin') {
    if (user.data.kc_adminright == 'Y') {
      routerNav.push({
        path: '/officeadmin/staffarrival',
      });
    } else {
      isAuthen.value = 7;
    }
  } else if (page === 'staffhistory') {
    routerNav.push({
      path: '/staffhistory',
    });
  } else if (page === 'staffchanges') {
    routerNav.push({
      path: '/staffchanges',
    });
  } else if (page === 'staffphoto') {
    routerNav.push({
      path: '/staffphoto',
    });
  } else if (page === 'expenses') {
    routerNav.push({
      path: '/expenses',
    });
  } else {
    // 不跳转那么就读取首页的图片，

    // has promission for kc
    isAuthen.value = 7;
  }
};

const goProjectProject = (area) => {
  let url = `/photosAll/${state.projectData[area]}`;
  window.open(url, '_blank');
};

// 加载图片
const loadImg = async (city: string, area: string) => {
  console.log('loadImg:' + city);
  let imgres = await API.GetIndexImg(city);
  if (imgres.code == 200) {
    let imginfo: ImageInfo = imgres.outlist;
    // 替换 Projectrotateimages 为 MMoser Project Photos
    let imgPath =
      imginfo.Imgpath.replace('Projectrotateimages', 'MMoser Project Photos')
        .split('/')
        .slice(0, -1)
        .toString()
        .replaceAll(',', '/') + '/';
    let res3 = await API.GetStorageImg({
      foldername: imgPath,
      filename: imginfo.Imgname,
      responseType: 'blob',
    });

    const blob = new Blob([res3]);
    let url = URL.createObjectURL(blob) as string;
    state.loadedImg[city] = url;
    state.projectData[area] = imginfo.Imgfolder;
    return url;
  }
};

// 改变城市
const changeCity = async (city: string, index: number): Promise<void> => {
  let { name }: AccountInfo = accounts.value[0];
  gaEvent('page_view', {
    event_category: 'general',
    event_label: 'changeCity',
    value: getFrontName(name) + ' - IndexBigImg Change: ' + city,
  });
  state.cur.city = city;
  if (state.urls[index] == undefined || state.urls[index]?.length == 0) {
    getImage(city, index);
  }
};

// const getImage = (officeid: string, index: number) => {
//   console.log(officeid);
//   state.urls[index] =
//     'https://mmoserkcstorage.blob.core.windows.net/$web/KCVUE_DOC/static/pc/main_' +
//     officeid +
//     '.jpg';
// };


// 10   15   20   30
// 55   70   90   110
// 40   55   60   80
// 60   80   80   90

const getImage = async (officeid: string, index: number): Promise<void> => {
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'authenticated',
    value: getFrontName(user.data.userename) + '- IndexBigImg: ' + officeid,
  });
  let imgres = await API.GetIndexImg(officeid);
  if (imgres.code == 200) {
    let imginfo: ImageInfo = imgres.outlist;
    // 替换 Projectrotateimages 为 MMoser Project Photos
    let imgPath =
      imginfo.Imgpath.replace('Projectrotateimages', 'MMoser Project Photos')
        .split('/')
        .slice(0, -1)
        .toString()
        .replaceAll(',', '/') + '/';
    let res3 = await API.GetStorageImg({
      foldername: imgPath,
      filename: imginfo.Imgname,
      responseType: 'blob',
    });

    const blob = new Blob([res3]);
    let url = URL.createObjectURL(blob);
    state.urls[index] = url;
  } else {
    ElMessage.error(`Loaded Index image failed!`);
  }
};

// 跳转到项目列表
const goProject2 = (city: string, event: MouseEvent): void => {
  event.stopPropagation(); // 阻止冒泡到div
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'authenticated',
    value: getFrontName(user.data.userename) + '- Project:' + state.cur.city,
  });
  const year: string = `${new Date().getFullYear() - 1}`;
  let url: string = indexData.pjLink;
  state.cur.year = year;
  url = url.replace('{city}', city).replace('{year}', year); // eslint-disable-line no-unused-vars
  console.log(`/photos/${city}`);
  // routerNav.push({
  //   path: `/photos/${city}`,
  // });
  let url2 = `/photos/${city}`;
  window.open(url2, '_blank');
};

// 跳转到项目列表
const goProject = (): void => {
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'authenticated',
    value: getFrontName(user.data.userename) + '- Project:' + state.cur.city,
  });
  const year: string = `${new Date().getFullYear() - 1}`;
  let url: string = indexData.pjLink;
  state.cur.year = year;
  url = url.replace('{city}', state.cur.city).replace('{year}', year); // eslint-disable-line no-unused-vars
  // window.open(url, '_blank');
  console.log(`/photos/${state.cur.city}`);
  routerNav.push({
    path: `/photos/${state.cur.city}`,
  });
};

const officeadminHandler = (): void => {
  gaEvent('page_view', {
    event_category: 'general',
    event_label: 'officeadminHandler',
    value: user.data.userename,
  });
  loaded = false;
  routerNav.push({
    path: '/officeadmin/staffreview',
  });
};

// 跳转管理页面
const adminHandler = (): void => {
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'authenticated',
    value: getFrontName(user.data.userename) + '-Admin',
  });
  loaded = false;
  routerNav.push({
    path: '/admin/admin',
  });
};

// 退出
const quitHandler = (): void => {
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'authenticated',
    value: getFrontName(user.data.userename) + ':quit',
  });
  loaded = false;
  instance.logoutRedirect();
};

// 登录
const loginRedirect = (): void => {
  gaEvent('page_view', {
    event_category: 'pageview',
    event_label: 'loginRedirect',
    value: 'Index - LoginRedirect',
  });
  instance.loginRedirect(loginRequest);
};


//          10        15    	    21  	    30  
// 粮	  50-65g	  60-80g	    80-110g	  100-120g
// 肉      25-40g	  50-55g	    60-80g	  70-85g
// 菜	  50-80g	  60-80g	    70-80g	  80-95g


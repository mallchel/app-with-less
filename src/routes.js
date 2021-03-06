const relativeRoutes = {
  section: { path: '/section/:sectionId' },
  catalog: { parent: 'section', path: '/catalog/:catalogId' },
  view: { parent: 'catalog', path: '/view/:viewId' },
  tab: { parent: 'view', path: '/:tabId' },
  record: { parent: 'tab', path: '/:recordId' }
};

const absoluteRoutes = {};

function getAbsolutePath(routeName) {
  const route = relativeRoutes[routeName];
  const parentPath = route.parent ? getAbsolutePath(route.parent) : '';
  return parentPath + route.path;
}

Object.keys(relativeRoutes).forEach(routeName => {
  absoluteRoutes[routeName] = {
    path: getAbsolutePath(routeName),
  }
});

export default absoluteRoutes;

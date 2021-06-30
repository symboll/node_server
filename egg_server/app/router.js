'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/user', controller.user.index)
  router.get('/user/:id', controller.user.detail)
  router.post('/user', controller.user.create)
  router.put('/user/:id', controller.user.update)
  router.delete('/user/:id', controller.user.remove)
};

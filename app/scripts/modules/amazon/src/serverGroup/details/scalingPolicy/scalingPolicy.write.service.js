'use strict';

const angular = require('angular');

import { TASK_EXECUTOR } from '@spinnaker/core';

module.exports = angular
  .module('spinnaker.amazon.serverGroup.details.scalingPolicy.write.service', [
    TASK_EXECUTOR,
  ])
  .factory('scalingPolicyWriter', function (taskExecutor) {

    function upsertScalingPolicy(application, command) {
      command.type = 'upsertScalingPolicy';
      return taskExecutor.executeTask({
        application: application,
        description: 'Upsert scaling policy ' + command.name,
        job: [command]
      });
    }

    function deleteScalingPolicy(application, serverGroup, scalingPolicy) {
      return taskExecutor.executeTask({
        application: application,
        description: 'Delete scaling policy ' + scalingPolicy.name,
        job: [
          {
            type: 'deleteScalingPolicy',
            provider: serverGroup.type,
            credentials: serverGroup.account,
            region: serverGroup.region,
            policyName: scalingPolicy.policyName,
            serverGroupName: serverGroup.name,
          }
        ]
      });
    }

    return {
      upsertScalingPolicy: upsertScalingPolicy,
      deleteScalingPolicy: deleteScalingPolicy,
    };
  });

define(
  'ephox.alloy.events.DefaultEvents',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.log.AlloyLogger',
    'ephox.sugar.api.dom.Compare',
    'global!console'
  ],

  function (AlloyEvents, SystemEvents, AlloyLogger, Compare, console) {
    // The purpose of this check is to ensure that a simulated focus call is not going
    // to recurse infinitely. Essentially, if the originator of the focus call is the same
    // as the element receiving it, and it wasn't its own target, then stop the focus call
    // and log a warning.
    var isRecursive = function (component, originator, target) {
      return Compare.eq(originator, component.element()) &&
        !Compare.eq(originator, target);
    };

    return {
      events: AlloyEvents.derive([
        AlloyEvents.can(SystemEvents.focus(), function (component, simulatedEvent) {
          // originator may not always be there. Will need to check this.
          var originator = simulatedEvent.event().originator();
          var target = simulatedEvent.event().target();
          if (isRecursive(component, originator, target)) {
            console.warn(
              SystemEvents.focus() + ' did not get interpreted by the desired target. ' +
              '\nOriginator: ' + AlloyLogger.element(originator) +
              '\nTarget: ' + AlloyLogger.element(target) +
              '\nCheck the ' + SystemEvents.focus() + ' event handlers'
            );
            return false;
          } else {
            return true;
          }
        })
      ])
    };
  }
);
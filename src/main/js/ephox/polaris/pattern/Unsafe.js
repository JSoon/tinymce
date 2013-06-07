define(
  'ephox.polaris.pattern.Unsafe',

  [
    'ephox.peanut.Fun',
    'ephox.polaris.pattern.Chars',
    'ephox.polaris.pattern.Custom'
  ],

  function (Fun, Chars, Custom) {
    var token = function (input) {
      return Custom(input, Fun.constant(0), Fun.constant(0));
    };

    var word = function (input) {
      var regex = '((?:^\'?)|(?:' + Chars.wordbreak() + '+\'?))' + input + '((?:\'?$)|(?:\'?' + Chars.wordbreak() + '+))';

      // ASSUMPTION: There are no groups in their input
      var prefix = function (match) {
        return match.length > 1 ? match[1].length : 0;
      };

      var suffix = function (match) {
        return match.length > 2 ? match[2].length : 0;
      };

      return Custom(regex, prefix, suffix);
    };

    return {
      token: token,
      word: word
    };
  }
);

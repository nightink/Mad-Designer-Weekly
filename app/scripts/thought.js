

angular.module('app')
  .factory('Thought', function() {

    function Thought(args) {
      this.title = args.title || 'Thoughts';
      this.content = args.content;
    }

    Thought.prototype.toMarkdown = function() {
      var markdown = this.markdown = ' ';

      markdown += '### ';
      markdown += this.title;
      markdown += ' \n\n  ';
      markdown += this.content;

      return markdown;
    }

    return Thought;
  });

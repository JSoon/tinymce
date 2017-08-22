define(
  'tinymce.plugins.tablenew.actions.TableCommands',

  [
    'ephox.darwin.api.TableSelection',
    'ephox.katamari.api.Option',
    'ephox.snooker.api.TableLookup',
    'ephox.sugar.api.node.Element',
    'tinymce.core.util.Tools',
    'tinymce.plugins.tablenew.actions.TableActions',
    'tinymce.plugins.tablenew.queries.TableTargets',
    'tinymce.plugins.tablenew.selection.Selections'
  ],

  function (TableSelection, Option, TableLookup, Element, Tools, TableActions, TableTargets, Selections) {
    var each = Tools.each;

    var registerCommands = function (editor, dialogs) {

      var actions = TableActions(editor);
      var selections = Selections(editor);

      var actOnSelection = function (execute) {
        var cell = Element.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        var table = TableLookup.table(cell);
        table.bind(function (table) {
          var targets = TableTargets.forMenu(selections, table, cell);
          execute(table, targets).each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
            TableSelection.clear(table);
          });
        });
      };

      // Register action commands
      each({
        mceTableSplitCells: function () {
          actOnSelection(actions.unmergeCells);
        },

        mceTableMergeCells: function () {
          actOnSelection(actions.mergeCells);
        },

        mceTableInsertRowBefore: function () {
          actOnSelection(actions.insertRowBefore);
        },

        mceTableInsertRowAfter: function () {
          actOnSelection(actions.insertRowAfter);
        },

        mceTableInsertColBefore: function () {
          actOnSelection(actions.insertColumnBefore);
        },

        mceTableInsertColAfter: function () {
          actOnSelection(actions.insertColumnAfter);
        },

        mceTableDeleteCol: function () {
          actOnSelection(actions.deleteColumn);
        },

        mceTableDeleteRow: function () {
          actOnSelection(actions.deleteRow);
        },

        // mceTableCutRow: function (grid) {
        //   clipboardRows = grid.cutRows();
        // },

        // mceTableCopyRow: function (grid) {
        //   clipboardRows = grid.copyRows();
        // },

        // mceTablePasteRowBefore: function (grid) {
        //   grid.pasteRows(clipboardRows, true);
        // },

        // mceTablePasteRowAfter: function (grid) {
        //   grid.pasteRows(clipboardRows);
        // },

        // mceSplitColsBefore: function (grid) {
        //   grid.splitCols(true);
        // },

        // mceSplitColsAfter: function (grid) {
        //   grid.splitCols(false);
        // },

        mceTableDelete: function (grid) {
          if (resizeBars) {
            resizeBars.clearBars();
          }
          grid.deleteTable();
        }
      }, function (func, name) {
        editor.addCommand(name, func);
      });

      // Register dialog commands
      each({
        mceInsertTable: dialogs.table,
        mceTableProps: function () {
          dialogs.table(true);
        },
        mceTableRowProps: dialogs.row,
        mceTableCellProps: dialogs.cell
      }, function (func, name) {
        editor.addCommand(name, function (ui, val) {
          func(val);
        });
      });
    };

    return {
      registerCommands: registerCommands
    };
  }
);

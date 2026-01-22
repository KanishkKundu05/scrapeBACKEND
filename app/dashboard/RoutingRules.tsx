"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function RoutingRules() {
  const rules = useQuery(api.routing.getRoutingRules);
  const createRule = useMutation(api.routing.createRoutingRule);
  const updateRule = useMutation(api.routing.updateRoutingRule);
  const deleteRule = useMutation(api.routing.deleteRoutingRule);
  const initializeDefaults = useMutation(api.routing.initializeDefaultRules);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"routingRules"> | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    keywords: "",
    priority: 5,
    responseTemplate: "",
    isActive: true,
  });

  const handleInitializeDefaults = async () => {
    const result = await initializeDefaults({});
    if (!result.success) {
      alert(result.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      keywords: "",
      priority: 5,
      responseTemplate: "",
      isActive: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (rule: NonNullable<typeof rules>[number]) => {
    setFormData({
      name: rule.name,
      keywords: rule.keywords.join(", "),
      priority: rule.priority,
      responseTemplate: rule.responseTemplate,
      isActive: rule.isActive,
    });
    setEditingId(rule._id);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = formData.keywords.split(",").map((k) => k.trim()).filter(Boolean);

    if (editingId) {
      await updateRule({
        ruleId: editingId,
        name: formData.name,
        keywords,
        priority: formData.priority,
        responseTemplate: formData.responseTemplate,
        isActive: formData.isActive,
      });
    } else {
      await createRule({
        name: formData.name,
        keywords,
        priority: formData.priority,
        responseTemplate: formData.responseTemplate,
        isActive: formData.isActive,
      });
    }
    resetForm();
  };

  const handleDelete = async (ruleId: Id<"routingRules">) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await deleteRule({ ruleId });
    }
  };

  const handleToggleActive = async (rule: NonNullable<typeof rules>[number]) => {
    await updateRule({
      ruleId: rule._id,
      isActive: !rule.isActive,
    });
  };

  if (rules === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 dark:border-slate-300"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Routing Rules
        </h2>
        <div className="flex gap-2">
          {rules.length === 0 && (
            <button
              onClick={handleInitializeDefaults}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Initialize Defaults
            </button>
          )}
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Add Rule
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            {editingId ? "Edit Rule" : "Add New Rule"}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="medical, sick, hospital, doctor"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Response Template
              </label>
              <textarea
                value={formData.responseTemplate}
                onChange={(e) => setFormData({ ...formData, responseTemplate: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-slate-300">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {editingId ? "Update" : "Create"} Rule
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {rules.length === 0 ? (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          No routing rules found. Click &quot;Initialize Defaults&quot; to add default rules.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-600">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Keywords
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rules
                .sort((a, b) => b.priority - a.priority)
                .map((rule) => (
                  <tr
                    key={rule._id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {rule.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rule.keywords.slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {rule.keywords.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{rule.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                      {rule.priority}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(rule)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          rule.isActive
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1 ${
                            rule.isActive ? "bg-green-500" : "bg-slate-400"
                          }`}
                        ></span>
                        {rule.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

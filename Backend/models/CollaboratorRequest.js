const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollaboratorRequestSchema = new Schema(
    {
        requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        recipient: { type: String, ref: 'User', required: true },
        project: { type: Schema.Types.ObjectId, ref: 'Project' }, // optional: request can be user-to-user or project-specific
        message: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'cancelled'],
            default: 'pending',
        },
        responseMessage: { type: String, trim: true },
        respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        respondedAt: { type: Date },
        expiresAt: { type: Date },
        read: { type: Boolean, default: false },
        meta: { type: Schema.Types.Mixed }, // place for any additional info
        token: { type: String }, // optional token for verification purposes
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

// Prevent multiple simultaneous pending requests for same requester/recipient/project
// Requires MongoDB that supports partial indexes.
CollaboratorRequestSchema.index(
    { requester: 1, recipient: 1, project: 1 },
    { unique: true, partialFilterExpression: { status: 'pending' } }
);

// Helper to set status and record responder
CollaboratorRequestSchema.methods.updateStatus = async function (status, { respondedBy = null, responseMessage = '' } = {}) {
    this.status = status;
    this.respondedBy = respondedBy;
    this.responseMessage = responseMessage;
    this.respondedAt = new Date();
    return this.save();
};

// Static helper to create request only if no pending duplicate exists
CollaboratorRequestSchema.statics.createIfNotPending = async function ({ requester, recipient, project = null, message = '', expiresAt = null, meta = {} }) {
    const existing = await this.findOne({ requester, recipient, project, status: 'pending' }).lean();
    if (existing) return null;
    return this.create({ requester, recipient, project, message, expiresAt, meta });
};

module.exports = mongoose.model('CollaboratorRequest', CollaboratorRequestSchema);
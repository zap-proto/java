package org.zap;

/**
 * An object that allocates memory for a ZAP message as it is being built.
 */
public interface Allocator {
    /**
     * Allocates a ByteBuffer to be used as a segment in a message. The returned
     * buffer must contain at least `minimumSize` bytes, all of which MUST be
     * set to zero.
     */
   public java.nio.ByteBuffer allocateSegment(int minimumSize);
}

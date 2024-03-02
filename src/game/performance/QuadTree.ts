export class QuadTree {
  private readonly maxObjects: number;
  private readonly maxDepth: number;
  private readonly objects: any[];
  private readonly bounds: any;
  private readonly children: QuadTree[];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    maxObjects: number,
    maxDepth: number
  ) {
    this.maxObjects = maxObjects;
    this.maxDepth = maxDepth;
    this.objects = [];
    this.bounds = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
    this.children = [];
  }

  insert(x: number, y: number, width: number, height: number): void {
    if (this.children.length !== 0) {
      const index = this.getIndex(x, y, width, height);
      if (index !== -1) {
        this.children[index].insert(x, y, width, height);
        return;
      }
    }

    this.objects.push({ x, y, width, height });

    if (
      this.objects.length > this.maxObjects &&
      this.children.length === 0 &&
      this.maxDepth > 0
    ) {
      this.split();
      let i = 0;
      while (i < this.objects.length) {
        const obj = this.objects[i];
        const index = this.getIndex(obj.x, obj.y, obj.width, obj.height);
        if (index !== -1) {
          this.children[index].insert(obj.x, obj.y, obj.width, obj.height);
          this.objects.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  }

  queryRegion(x: number, y: number, width: number, height: number): any[] {
    const foundObjects: any[] = [];
    const index = this.getIndex(x, y, width, height);
    if (index !== -1 && this.children.length !== 0) {
      foundObjects.push(
        ...this.children[index].queryRegion(x, y, width, height)
      );
    } else {
      for (const obj of this.objects) {
        if (
          obj.x < x + width &&
          obj.x + obj.width > x &&
          obj.y < y + height &&
          obj.y + obj.height > y
        ) {
          foundObjects.push(obj);
        }
      }
    }
    return foundObjects;
  }

  private getIndex(
    x: number,
    y: number,
    width: number,
    height: number
  ): number {
    const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
    const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    const topQuadrant =
      y < horizontalMidpoint && y + height < horizontalMidpoint;
    const bottomQuadrant = y > horizontalMidpoint;

    if (x < verticalMidpoint && x + width < verticalMidpoint) {
      if (topQuadrant) {
        return 1;
      } else if (bottomQuadrant) {
        return 2;
      }
    } else if (x > verticalMidpoint) {
      if (topQuadrant) {
        return 0;
      } else if (bottomQuadrant) {
        return 3;
      }
    }

    return -1;
  }

  private split(): void {
    const subWidth = this.bounds.width / 2;
    const subHeight = this.bounds.height / 2;
    const x = this.bounds.x;
    const y = this.bounds.y;

    this.children.push(
      new QuadTree(
        x + subWidth,
        y,
        subWidth,
        subHeight,
        this.maxObjects,
        this.maxDepth - 1
      )
    );
    this.children.push(
      new QuadTree(
        x,
        y,
        subWidth,
        subHeight,
        this.maxObjects,
        this.maxDepth - 1
      )
    );
    this.children.push(
      new QuadTree(
        x,
        y + subHeight,
        subWidth,
        subHeight,
        this.maxObjects,
        this.maxDepth - 1
      )
    );
    this.children.push(
      new QuadTree(
        x + subWidth,
        y + subHeight,
        subWidth,
        subHeight,
        this.maxObjects,
        this.maxDepth - 1
      )
    );
  }
}

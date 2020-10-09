import CompleteView from '@/views/Complete';

describe('complete view', () => {
  let instance: CompleteView;

  beforeEach(() => {
    instance = new CompleteView();
  });

  it('pass params', () => {
    instance = new CompleteView({
      avgTime: 3,
      totalScore: 12,
      totalTime: 36,
      successCount: 12,
    });
    expect(instance.avgTime).toBe(3);
    expect(instance.totalScore).toBe(12);
    expect(instance.totalTime).toBe(36);
    expect(instance.successCount).toBe(12);
  });

  it('check render result', () => {
    const renderHtml = instance.render();
    expect(instance.$componentEl).toBeDefined();
    expect(renderHtml).toBeInstanceOf(HTMLElement);
  });
});
